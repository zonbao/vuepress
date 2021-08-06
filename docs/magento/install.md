# 开始安装  
Magento是Adobe公司旗下一个功能丰富的专业开源电子商务解决方案，为商家提供一个外观、内容和功能的完全灵活控制。Magento直观的管理界面包含强大的营销、商品推销和内容管理工具，使商家能够创建适合其独特业务需求的站点。Magento号称宇宙最强企业终极电子商务解决方案。  
- 演示站点: <https://venia.magento.com>
::: tip 注意  
- 服务器使用 [Vultr](https://www.vultr.com/?ref=8417685-6G) 的Ubuntu20.04 系统
- 为什么选择 Vultr? 主要是按时计费, 随时取消. 练手的最佳选择.
:::
## 1. 安装java
``` :no-line-numbers
sudo apt-get -y update
```
``` :no-line-numbers
sudo apt-get install -y openjdk-8-jdk
```
## 2. 安装Elasticsearch
``` :no-line-numbers
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
```
``` :no-line-numbers
sudo apt-get install apt-transport-https
```
``` :no-line-numbers
echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-7.x.list
```
``` :no-line-numbers
sudo apt-get update && sudo apt-get install elasticsearch
```
## 3. 启动elasticsearch
``` :no-line-numbers
/etc/init.d/elasticsearch start
```
## 4. 配置elasticsearch随机启动
``` :no-line-numbers
sudo /bin/systemctl daemon-reload
```
``` :no-line-numbers
sudo /bin/systemctl enable elasticsearch.service
``` 
## 5. 安装宝塔
``` :no-line-numbers
wget -O install.sh http://download.bt.cn/install/install-ubuntu_6.0.sh && sudo bash install.sh
```
## 6. 登录宝塔安装环境
::: tip 提示
我这里安装的套件是: nginx1.19 + mysql5.7+php7.4  
- mysql的版本不要低于5.7
- php版本最好是7.4, 如果要改的话, 下面nginx配置的第一步对应的也要改成对应的版本.
:::
![安装网站环境](/images/topics/2021-08-05/nginx-mysql-php.png)
## 7. 安装必要的PHP扩展
``` :no-line-numbers
fileinfo
imap
xsl
opcache
imagemagick
exif
intl
```
![安装网站环境](/images/topics/2021-08-05/php-ex.png)  
## 8. 删除下列被禁用的函数
``` :no-line-numbers
openlog
syslog
pcntl_signal
proc_open
system
exec
putenv
shell_exec
```
![安装网站环境](/images/topics/2021-08-05/php-func.png)  
## 9. 环境安装完成后，添加站点
![安装网站环境](/images/topics/2021-08-05/add-website.png)
## 10. 修改Nginx配置
::: warning 注意
- 注意下面的顺序不要错，要不然会报错
:::
### 1. 复制以下代码框里的内容然后粘贴到站点配置里的配置文件最前面
```
upstream fastcgi_backend {
    server   unix:/tmp/php-cgi-74.sock;
}
```
::: warning 注意
以上这段代码只需要配置一次, 在同一个宝塔面板下, 如果以后你再添加其他站点, 请不要再次复制粘贴这段代码!!!
:::
![安装网站环境](/images/logo.png)  
### 2. 修改nginx配置文件  
- 删除index index.php ... 那整行，并将root 改成 set $MAGE_ROOT 如下图
- 删除include enable-php-74.conf 这一行, 或者在这行前面添加一个 # 注释掉. 下图没有删,请自行删除
![安装网站环境](/images/topics/2021-08-05/nginx-config.jpg)  
### 3. nginx伪静态规则：复制以下代码框里的内容然后粘贴到站点配置里的伪静态里。
::: details 点击获取
``` :no-line-numbers
## Example configuration:
# upstream fastcgi_backend {
#    # use tcp connection
#    # server  127.0.0.1:9000;
#    # or socket
#    server   unix:/var/run/php/php7.4-fpm.sock;
# }
# server {
#    listen 80;
#    server_name mage.dev;
#    set $MAGE_ROOT /var/www/magento2;
#    set $MAGE_DEBUG_SHOW_ARGS 0;
#    include /vagrant/magento2/nginx.conf.sample;
# }
#
## Optional override of deployment mode. We recommend you use the
## command 'bin/magento deploy:mode:set' to switch modes instead.
##
## set $MAGE_MODE default; # or production or developer
##
## If you set MAGE_MODE in server config, you must pass the variable into the
## PHP entry point blocks, which are indicated below. You can pass
## it in using:
##
## fastcgi_param  MAGE_MODE $MAGE_MODE;
##
## In production mode, you should uncomment the 'expires' directive in the /static/ location block

# Modules can be loaded only at the very beginning of the Nginx config file, please move the line below to the main config file
# load_module /etc/nginx/modules/ngx_http_image_filter_module.so;

root $MAGE_ROOT/pub;

index index.php;
autoindex off;
charset UTF-8;
error_page 404 403 = /errors/404.php;
#add_header "X-UA-Compatible" "IE=Edge";


# Deny access to sensitive files
location /.user.ini {
    deny all;
}

# PHP entry point for setup application
location ~* ^/setup($|/) {
    root $MAGE_ROOT;
    location ~ ^/setup/index.php {
        fastcgi_pass   fastcgi_backend;

        fastcgi_param  PHP_FLAG  "session.auto_start=off \n suhosin.session.cryptua=off";
        fastcgi_param  PHP_VALUE "memory_limit=756M \n max_execution_time=600";
        fastcgi_read_timeout 600s;
        fastcgi_connect_timeout 600s;

        fastcgi_index  index.php;
        fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
        include        fastcgi_params;
    }

    location ~ ^/setup/(?!pub/). {
        deny all;
    }

    location ~ ^/setup/pub/ {
        add_header X-Frame-Options "SAMEORIGIN";
    }
}

# PHP entry point for update application
location ~* ^/update($|/) {
    root $MAGE_ROOT;

    location ~ ^/update/index.php {
        fastcgi_split_path_info ^(/update/index.php)(/.+)$;
        fastcgi_pass   fastcgi_backend;
        fastcgi_index  index.php;
        fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
        fastcgi_param  PATH_INFO        $fastcgi_path_info;
        include        fastcgi_params;
    }

    # Deny everything but index.php
    location ~ ^/update/(?!pub/). {
        deny all;
    }

    location ~ ^/update/pub/ {
        add_header X-Frame-Options "SAMEORIGIN";
    }
}

location / {
    try_files $uri $uri/ /index.php$is_args$args;
}

location /pub/ {
    location ~ ^/pub/media/(downloadable|customer|import|custom_options|theme_customization/.*\.xml) {
        deny all;
    }
    alias $MAGE_ROOT/pub/;
    add_header X-Frame-Options "SAMEORIGIN";
}

location /static/ {
    # Uncomment the following line in production mode
    # expires max;

    # Remove signature of the static files that is used to overcome the browser cache
    location ~ ^/static/version {
        rewrite ^/static/(version\d*/)?(.*)$ /static/$2 last;
    }

    location ~* \.(ico|jpg|jpeg|png|gif|svg|js|css|swf|eot|ttf|otf|woff|woff2|html|json)$ {
        add_header Cache-Control "public";
        add_header X-Frame-Options "SAMEORIGIN";
        expires +1y;

        if (!-f $request_filename) {
            rewrite ^/static/(version\d*/)?(.*)$ /static.php?resource=$2 last;
        }
    }
    location ~* \.(zip|gz|gzip|bz2|csv|xml)$ {
        add_header Cache-Control "no-store";
        add_header X-Frame-Options "SAMEORIGIN";
        expires    off;

        if (!-f $request_filename) {
           rewrite ^/static/(version\d*/)?(.*)$ /static.php?resource=$2 last;
        }
    }
    if (!-f $request_filename) {
        rewrite ^/static/(version\d*/)?(.*)$ /static.php?resource=$2 last;
    }
    add_header X-Frame-Options "SAMEORIGIN";
}

location /media/ {

## The following section allows to offload image resizing from Magento instance to the Nginx.
## Catalog image URL format should be set accordingly.
## See https://docs.magento.com/user-guide/configuration/general/web.html#url-options
#   location ~* ^/media/catalog/.* {
#
#       # Replace placeholders and uncomment the line below to serve product images from public S3
#       # See examples of S3 authentication at https://github.com/anomalizer/ngx_aws_auth
#       # resolver 8.8.8.8;
#       # proxy_pass https://<bucket-name>.<region-name>.amazonaws.com;
#
#       set $width "-";
#       set $height "-";
#       if ($arg_width != '') {
#           set $width $arg_width;
#       }
#       if ($arg_height != '') {
#           set $height $arg_height;
#       }
#       image_filter resize $width $height;
#       image_filter_jpeg_quality 90;
#   }

    try_files $uri $uri/ /get.php$is_args$args;

    location ~ ^/media/theme_customization/.*\.xml {
        deny all;
    }

    location ~* \.(ico|jpg|jpeg|png|gif|svg|js|css|swf|eot|ttf|otf|woff|woff2)$ {
        add_header Cache-Control "public";
        add_header X-Frame-Options "SAMEORIGIN";
        expires +1y;
        try_files $uri $uri/ /get.php$is_args$args;
    }
    location ~* \.(zip|gz|gzip|bz2|csv|xml)$ {
        add_header Cache-Control "no-store";
        add_header X-Frame-Options "SAMEORIGIN";
        expires    off;
        try_files $uri $uri/ /get.php$is_args$args;
    }
    add_header X-Frame-Options "SAMEORIGIN";
}

location /media/customer/ {
    deny all;
}

location /media/downloadable/ {
    deny all;
}

location /media/import/ {
    deny all;
}

location /media/custom_options/ {
    deny all;
}

location /errors/ {
    location ~* \.xml$ {
        deny all;
    }
}

# PHP entry point for main application
location ~ ^/(index|get|static|errors/report|errors/404|errors/503|health_check)\.php$ {
    try_files $uri =404;
    fastcgi_pass   fastcgi_backend;
    fastcgi_buffers 16 16k;
    fastcgi_buffer_size 32k;

    fastcgi_param  PHP_FLAG  "session.auto_start=off \n suhosin.session.cryptua=off";
    fastcgi_param  PHP_VALUE "memory_limit=756M \n max_execution_time=18000";
    fastcgi_read_timeout 600s;
    fastcgi_connect_timeout 600s;

    fastcgi_index  index.php;
    fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
    include        fastcgi_params;
}

gzip on;
gzip_disable "msie6";

gzip_comp_level 6;
gzip_min_length 1100;
gzip_buffers 16 8k;
gzip_proxied any;
gzip_types
    text/plain
    text/css
    text/js
    text/xml
    text/javascript
    application/javascript
    application/x-javascript
    application/json
    application/xml
    application/xml+rss
    image/svg+xml;
gzip_vary on;

# Banned locations (only reached if the earlier PHP entry point regexes don't match)
location ~* (\.php$|\.phtml$|\.htaccess$|\.git) {
    deny all;
}
```
:::
![安装网站环境](/images/topics/2021-08-05/nginx-rewrite.png)  
## 11. 修改配置防止内存占用过高
打开`/etc/elasticsearch/jvm.options`文件, 添加以下两行内容
``` :no-line-numbers
-Xms1g
-Xmx1g
```
![安装网站环境](/images/topics/2021-08-05/es-config.png)  
## 12. 重启Elasticsearch
``` :no-line-numbers
/etc/init.d/elasticsearch start
```  
## 13. 查看Elasticsearch状态
``` :no-line-numbers
/etc/init.d/elasticsearch status
```
输出显示类似下图:  
![安装网站环境](/images/topics/2021-08-05/es-status.png)  
## 14. 终端下进入站点目录
``` :no-line-numbers
cd /www/wwwroot/luzongbao.com
```
::: warning 注意
上面的网站目录的路径要改成你自己的正确的路径
:::
``` :no-line-numbers
chattr -i .user.ini && rm -f index.html .user.ini .htaccess 404.html
```
## 15. 拉取magento2代码
``` :no-line-numbers
su www -s /bin/bash -c "composer create-project --repository-url=https://repo.magento.com/ magento/project-community-edition ."
```
## 16. 设置权限
``` :no-line-numbers
find var generated vendor pub/static pub/media app/etc -type f -exec chmod g+w {} + && find var generated vendor pub/static pub/media app/etc -type d -exec chmod g+ws {} + && chown -R www:www . && chmod u+x bin/magento
```
## 17. 安装数据库
``` :no-line-numbers
bin/magento setup:install \
--base-url=网址 \
--db-host=localhost \
--db-name=数据库 \
--db-user=数据库用户名 \
--db-password=数据库密码(要有大小写字母与数字） \
--admin-firstname=姓 \
--admin-lastname=名 \
--admin-email=管理员邮箱 \
--backend-frontname=admin \
--admin-user=登录网站后台的用户名 \
--admin-password=登录网站后台的密码 \
--language=en_US \
--currency=USD \
--timezone=Asia/Shanghai \
--use-rewrites=1
```
::: warning 注意
将上面有中文的地方改成你自己的正确的配置
:::
例子
``` :no-line-numbers
bin/magento setup:install \
--base-url=https://luzongbao.com \
--db-host=localhost \
--db-name=luzonbao_com \
--db-user=luzonbao_com \
--db-password=xwkE7tPseHkpFwi4 \
--admin-firstname=zongbao \
--admin-lastname=lu \
--admin-email=support@luzongbao.com \
--backend-frontname=admin \
--admin-user=zonbao \
--admin-password=R8vhVrwi8Vzhdm3X \
--language=en_US \
--currency=USD \
--timezone=Asia/Shanghai \
--use-rewrites=1
```
## 18. 取消登录后台的两步授权
``` :no-line-numbers
bin/magento module:disable Magento_TwoFactorAuth
```
## 19. 安装magento2的计划任务
``` :no-line-numbers
sudo -u www bin/magento cron:install
```
:tada: :tada: :tada:  现在已经安装完成，可以通过自己的域名访问网站，登录网站后台了。  
::: tip 这是我的网站网址与后台
- 网站: https://luzongbao.com
- 后台: https://luzongbao.com/admin
:::
