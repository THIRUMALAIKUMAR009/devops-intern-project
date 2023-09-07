pipeline {
    agent any
  stages {
    stage ('image build and Push') {
      steps {
        sh '''
            ls
             systemctl status docker
            docker rm -f $(docker ps -a -q)        
            aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/n6h4i3k0
            docker build -t sampleapp:${BUILD_NUMBER} .
            docker tag sampleapp:1 public.ecr.aws/n6h4i3k0/devopskadit:latest
            docker push public.ecr.aws/n6h4i3k0/devopskadit:latest
            docker run -d -p 3000:3000 sampleapp:1
        '''
      }
    }
    stage('backend image build and push') { 
      steps {
        sh'''
           ls
           cd server
           aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/n6h4i3k0
           docker build -t backendsampleapp:${BUILD_NUMBER} .
           docker tag backendsampleapp:1 public.ecr.aws/n6h4i3k0/backenddevops:latest
           docker push public.ecr.aws/n6h4i3k0/backenddevops:latest
           docker run -d -p 5000:5000 backendsampleapp:1
        ''' 
      }
    }
  }
}