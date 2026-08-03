import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'categories.categories.index': { paramsTuple?: []; params?: {} }
    'categories.categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.categories.store': { paramsTuple?: []; params?: {} }
    'categories.categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.index': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'categories.categories.index': { paramsTuple?: []; params?: {} }
    'categories.categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'categories.categories.index': { paramsTuple?: []; params?: {} }
    'categories.categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'categories.categories.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'categories.categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'categories.categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}