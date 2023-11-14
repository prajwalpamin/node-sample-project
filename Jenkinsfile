pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }
    parameters {
        string(name: 'GIT_REPO_URL', description: 'URL of the Git repository containing the Helm chart', defaultValue: 'https://gitlab.com/divya5844828/network.git')
        string(name: 'GIT_CREDENTIALS_ID', description: 'Credentials ID for accessing the Git repository', defaultValue: 'DivyaRshet')
        string(name: 'REPO_FOLDER_NAME', description: 'folder name', defaultValue: 'network')
        string(name: 'GIT_EMAIL', description: 'git emial', defaultValue: 'dvd1678dvd45@gmail.com')
        string(name: 'USER_NAME', description: 'git username', defaultValue: 'DivyaRshet')
        string(name: 'BRANCH', description: 'git helm branch', defaultValue: 'main')
    }

    environment {
            PROJECT_ID = "tech-rnd-project"
            CLUSTER_NAME = "network18"
            LOCATION = "us-central1-a"
            CREDENTIALS_ID = "kubernetes"
            VERSION = "2.2.${env.BUILD_NUMBER}"
    }

    stages {
        stage('Scm Checkout') {
            steps {
                    checkout scm
            }
        }
        stage('install dependancies') {
            steps {
                echo 'building the software'
                sh 'npm install --force'
            }
        }

        stage('test') {
            steps {
                //add steps to test here
                echo 'testing'
            }
        }

        stage('sonar scanning') {
            steps {
                //add steps here
                echo 'sonar scanning'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'whoami'
                sh 'sudo chmod 777 /var/run/docker.sock'
                sh 'sudo apt update'
                sh 'sudo apt install software-properties-common -y'
                sh 'sudo add-apt-repository ppa:cncf-buildpacks/pack-cli'
                sh 'sudo  apt-get update'
                sh 'sudo apt-get install pack-cli'
                sh 'pack build nodejsss --builder gcr.io/buildpacks/builder:google-22'
                sh "docker tag nodejsss us-central1-docker.pkg.dev/tech-rnd-project/net18-artefact/nodee:${env.VERSION}"
            }
        }

        stage('image scan') {
            steps {
                //add steps here
                echo 'image scanning'
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    echo 'Push Docker Image'
                    sh 'gcloud auth configure-docker us-central1-docker.pkg.dev'
                    sh "docker push us-central1-docker.pkg.dev/tech-rnd-project/net18-artefact/nodee:${env.VERSION}"
                }
            }
        }

                stage('Update Helm Chart') {
                    steps {
                        // Clone the GitLab repository containing the Helm chart
                        dir("${params.REPO_FOLDER_NAME}") {
                            git branch: "${params.BRANCH}",
                            credentialsId:"${params.GIT_CREDENTIALS_ID}",
                            url: "${params.GIT_REPO_URL}"
                        }

                        // Update the image tag in the values.yaml file
                        dir("${params.REPO_FOLDER_NAME}/helm") {
                            script {
                                def valuesFile = readFile('values.yaml')
                                def updatedValues = valuesFile.replaceAll(/tag: .*/, "tag: ${env.VERSION}")
                                writeFile file: 'values.yaml', text: updatedValues
                            }
                        }

                        // Commit and push the changes to the GitLab repository
                        dir("${params.REPO_FOLDER_NAME}") {
                            sh 'ls'
                            sh 'pwd'
                            sh 'git config credential.helper store'
                            sh "git config --global user.email '${params.REPO_FOLDER_NAME}'"
                            sh "git config --global user.name '${params.REPO_FOLDER_NAME}'"
                            sh 'git add .'
                            sh 'git commit -m "Update image tag"'
                            sh "git push --set-upstream origin '${params.BRANCH}'"
                        }
                    }
                }
    }

    post {
        always {
            emailext to: 'admin@gmail.com',
            subject: "jenkins build:${currentBuild.currentResult}: ${env.JOB_NAME}",
            body: "${currentBuild.currentResult}: Job ${env.JOB_NAME}\nMore Info can be found in the attached log",
            attachLog: true
        }
    }
}
