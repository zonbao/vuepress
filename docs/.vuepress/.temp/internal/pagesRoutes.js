import { Vuepress } from '@vuepress/client/lib/components/Vuepress'

const routeItems = [
  ["v-8daa1a0e","/","跨境电商,亚马逊选品与运营,独立站建站与推广分享",["/index.html","/README.md"]],
  ["v-5b68af5e","/magento/","开始安装",["/magento/index.html","/magento/README.md"]],
  ["v-f9ec7d74","/magento/advanced.html","高级技巧",["/magento/advanced","/magento/advanced.md"]],
  ["v-318201e5","/magento/compare.html","介绍",["/magento/compare","/magento/compare.md"]],
  ["v-62e421e6","/magento/config.html","基本设置",["/magento/config","/magento/config.md"]],
  ["v-210d4ab2","/magento/getting-started.html","前期准备",["/magento/getting-started","/magento/getting-started.md"]],
  ["v-b7c3ca22","/magento/install.html","开始安装",["/magento/install","/magento/install.md"]],
  ["v-73dd77ec","/magento/plugins.html","安装插件",["/magento/plugins","/magento/plugins.md"]],
  ["v-3706649a","/404.html","",["/404"]],
]

export const pagesRoutes = routeItems.reduce(
  (result, [name, path, title, redirects]) => {
    result.push(
      {
        name,
        path,
        component: Vuepress,
        meta: { title },
      },
      ...redirects.map((item) => ({
        path: item,
        redirect: path,
      }))
    )
    return result
  },
  [
    {
      name: "404",
      path: "/:catchAll(.*)",
      component: Vuepress,
    }
  ]
)
