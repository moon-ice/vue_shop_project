import Vue from 'vue'
import { Button, Switch } from 'element-ui'
import { Form,FormItem } from 'element-ui'
import { Input } from 'element-ui'
import { Message } from 'element-ui'

import { Container } from 'element-ui'
import { Aside } from 'element-ui'
import { Header } from 'element-ui'
import { Main } from 'element-ui'

import { Menu } from 'element-ui'
import { Submenu } from 'element-ui'
import { MenuItem } from 'element-ui'

import { Breadcrumb } from 'element-ui'
import { BreadcrumbItem } from 'element-ui'

import { Card } from 'element-ui'
import { Row } from 'element-ui'
import { Col } from 'element-ui'

import { Table } from 'element-ui'
import { TableColumn } from 'element-ui'
import { Tooltip } from 'element-ui'
import { Pagination } from 'element-ui'
import { Dialog } from 'element-ui'
import { MessageBox } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

Vue.use(Container)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Main)

Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)

Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)

Vue.use(Card)
Vue.use(Row)
Vue.use(Col)

Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
//Message和MessageBox需要挂载到全剧组件
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm