# 安装插件
- Magento官方插件网站: <https://marketplace.magento.com>  
::: tip 说明
请尽量只安装自己必要的插件, 安装太多插件可能导致网站速度下降, 可能产生各种不可意料的错误  
Magento的原始模板已经完全可以满足产生需求. 下单收款发货完全可以完成了.
我自己运营的站点基本上只是在magento的原始代码上修改一下模板颜色再安装两三个必要插件  
建电子商务站点的主要目标是成交, 精力应该花在网站的引流上, 而不是过多花精力在把网站做得多么多么好看
:::
1. ## 安装SMTP发件插件
::: warning 第一个要安装的插件
这是一款电子邮件发件插件, 所有的新订单邮件, 注册后的欢迎邮件, 发票邮件, 发货邮件, 联系邮件等
都是通过这个SMTP发件服务发送的.
:::
``` :no-line-numbers
su www -s /bin/bash -c "composer require mageplaza/module-core"
```
``` :no-line-numbers
su www -s /bin/bash -c "composer require mageplaza/module-smtp"
```
``` :no-line-numbers
sudo -u www bin/magento setup:upgrade
```
``` :no-line-numbers
sudo -u www bin/magento setup:static-content:deploy -f
```
2. ## 安装产品Feed插件