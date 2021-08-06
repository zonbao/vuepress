<template><h1 id="安装插件" tabindex="-1"><a class="header-anchor" href="#安装插件" aria-hidden="true">#</a> 安装插件</h1>
<ul>
<li>Magento官方插件网站: <a href="https://marketplace.magento.com" target="_blank" rel="noopener noreferrer">https://marketplace.magento.com<OutboundLink/></a></li>
</ul>
<div class="custom-container tip"><p class="custom-container-title">说明</p>
<p>请尽量只安装自己必要的插件, 安装太多插件可能导致网站速度下降, 可能产生各种不可意料的错误<br>
Magento的原始模板已经完全可以满足产生需求. 下单收款发货完全可以完成了.
我自己运营的站点基本上只是在magento的原始代码上修改一下模板颜色再安装两三个必要插件<br>
建电子商务站点的主要目标是成交, 精力应该花在网站的引流上, 而不是过多花精力在把网站做得多么多么好看</p>
</div>
<ol>
<li>
<h2 id="安装smtp发件插件" tabindex="-1"><a class="header-anchor" href="#安装smtp发件插件" aria-hidden="true">#</a> 安装SMTP发件插件</h2>
</li>
</ol>
<div class="custom-container warning"><p class="custom-container-title">第一个要安装的插件</p>
<p>这是一款电子邮件发件插件, 所有的新订单邮件, 注册后的欢迎邮件, 发票邮件, 发货邮件, 联系邮件等
都是通过这个SMTP发件服务发送的.</p>
</div>
<div class="language-text ext-text"><pre v-pre class="language-text"><code>su www -s /bin/bash -c "composer require mageplaza/module-core"
</code></pre></div><div class="language-text ext-text"><pre v-pre class="language-text"><code>su www -s /bin/bash -c "composer require mageplaza/module-smtp"
</code></pre></div><div class="language-text ext-text"><pre v-pre class="language-text"><code>sudo -u www bin/magento setup:upgrade
</code></pre></div><div class="language-text ext-text"><pre v-pre class="language-text"><code>sudo -u www bin/magento setup:static-content:deploy -f
</code></pre></div><ol start="2">
<li>
<h2 id="安装产品feed插件" tabindex="-1"><a class="header-anchor" href="#安装产品feed插件" aria-hidden="true">#</a> 安装产品Feed插件</h2>
</li>
</ol>
</template>
