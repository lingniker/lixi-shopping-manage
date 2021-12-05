import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/shop',
    method: 'get',
    params: query
  })
}

// 创建商品
export function create (query) {
  return request({
    url: '/shop/create',
    method: 'post',
    data: query
  })
}

// 创建商品
export function update (query) {
  return request({
    url: '/shop/update',
    method: 'post',
    data: query
  })
}
