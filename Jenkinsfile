pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = 'Web123'
        DOCKER_HUB_USER        = 'timden1349'
        IMAGE_TAG              = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
        HELM_NAMESPACE         = 'default'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Images') {
            parallel {
                stage('Build Client') {
                    steps {
                        script {
                            docker.build("${DOCKER_HUB_USER}/client:${IMAGE_TAG}", "./client")
                        }
                    }
                }
                stage('Build Server') {
                    steps {
                        script {
                            docker.build("${DOCKER_HUB_USER}/server:${IMAGE_TAG}", "./server")
                        }
                    }
                }
            }
        }

        stage('Push Images') {
            steps {
                script {
                    docker.withRegistry('', DOCKER_HUB_CREDENTIALS) {
                        docker.image("${DOCKER_HUB_USER}/client:${IMAGE_TAG}").push()
                        docker.image("${DOCKER_HUB_USER}/server:${IMAGE_TAG}").push()
                    }
                }
            }
        }

        stage('Deploy to k3s') {
            steps {
                script {
                    sh """
                        helm upgrade --install server ./charts/server \
                          --namespace ${HELM_NAMESPACE} --create-namespace \
                          --set image.tag=${IMAGE_TAG} \
                          --wait --timeout 5m

                        helm upgrade --install client ./charts/client \
                          --namespace ${HELM_NAMESPACE} \
                          --set image.tag=${IMAGE_TAG} \
                          --wait --timeout 5m
                    """
                }
            }
        }

        stage('Verify Rollout') {
            steps {
                script {
                    sh """
                        kubectl rollout status deployment/server -n ${HELM_NAMESPACE} --timeout=120s
                        kubectl rollout status deployment/client -n ${HELM_NAMESPACE} --timeout=120s
                    """
                }
            }
        }
    }
}