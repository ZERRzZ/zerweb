FROM registry.htres.cn/yunlu/tomcat:latest
MAINTAINER huangwenfeng@htyunwang.com

EXPOSE 8080

# RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
# RUN echo 'Asia/Shanghai' >/etc/timezone

RUN ["/bin/bash", "-c", "rm -fr /usr/local/tomcat/webapps/ROOT"]
RUN ["/bin/bash", "-c", "rm -fr /usr/local/tomcat/webapps/docs"]
RUN ["/bin/bash", "-c", "rm -fr /usr/local/tomcat/webapps/examples"]
RUN ["/bin/bash", "-c", "rm -fr /usr/local/tomcat/webapps/host-manager"]
RUN ["/bin/bash", "-c", "rm -fr /usr/local/tomcat/webapps/manager"]


# 将web安装包复制到容器中
COPY dist/ /usr/local/tomcat/webapps/admin

CMD ["catalina.sh","run"]
