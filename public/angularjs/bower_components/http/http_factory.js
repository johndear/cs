'use strict';

angular.module('chatApp').factory('transformRequestAsFormPostUtil', function () {
    /*
     * 将 $http 方法的 data 按 form 方式发送
     */
    function serializeData(data) {
        // If this is not an object, defer to native stringification.
        if (!angular.isObject(data)) {
            return data ? data.toString() : '';
        }

        var buffer = [],
            name,
            val;
        // Serialize each key in the object.
        for (name in data) {
            if (data.hasOwnProperty(name)) {
                val = data[name];
                buffer.push(
                        encodeURIComponent(name) +
                        '=' +
                        encodeURIComponent(val === null ? '' : val)
                );
            }
        }
        // Serialize the buffer and clean it up for transportation.
        return buffer.join('&').replace(/%20/g, '+');
    }

    // I prepare the request data for the form post.
    return function transformRequest(data, getHeaders) {
        var headers = getHeaders();
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        return serializeData(data);
    };
})
    /*
     * 检查登录状态
     */
    .factory('transformResponseCheckLoginUtil', function () {
        return function (res) {
            var data;
            try {
                data = JSON.parse(res);
                // 检查 data.code
                if (data.code) {
                    switch (data.code) {
                        // 没登录
                        case 101:
                            location.href = 'login';
                            break;
                        // 没有权限
                        default:
                            window.alert(data.msg);
                    }
                }
            } catch (e) {
            }
            // 原数据返回
            return data;
        };
    })
    /*
     * 统一全部 RESTful 资源加载方式
     */
    .factory('baseResource', function ($resource, transformRequestAsFormPostUtil, transformResponseCheckLoginUtil) {
        return function (resourceType, extActions) {
            // 重写 action
            var actions = {
                // 查询列表
                query: {
                    method: 'GET',
                    url: resourceType + '/queryAll',
                    isArray: true
                    // cache: true
                },
                // 读取单个
                get: {
                    method: 'GET',
                    url: resourceType + '/find'
                },
                // 添加
                put: {
                    method: 'POST',
                    url: resourceType + '/create'
                },
                // 更新
                save: {
                    method: 'POST',
                    url: resourceType + '/update'
                },
                // 删除
                remove: {
                    method: 'POST',
                    url: resourceType + '/delete'
                }
            };
            // 扩展 action
            if (extActions) {
                angular.extend(actions, extActions);
            }
            angular.forEach(actions, function (action) {
                action.transformRequest = transformRequestAsFormPostUtil;
                if (action.method === 'POST') {
                    action.transformResponse = transformResponseCheckLoginUtil;
                }
            });

            return $resource(resourceType + '/:id', null, actions);
        };
    })
    .factory('formPostUtil', function ($http, transformRequestAsFormPostUtil, transformResponseCheckLoginUtil) {
        /*
         * form 方式发送的 post 方法
         */
        return function (path, data) {
            return $http({
                url: path,
                method: 'POST',
                transformRequest: transformRequestAsFormPostUtil,
                transformResponse: transformResponseCheckLoginUtil,
                data: data
            });
        };
    });