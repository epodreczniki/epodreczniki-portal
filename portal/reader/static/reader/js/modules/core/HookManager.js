define(['./Registry', 'underscore'], function(Registry, _){
    if(!Registry.get('hooks')){
        Registry.set('hooks', {});
    }
    return {
        addHook: function(hookName, handler){
            var hooks = Registry.get('hooks');
            hooks[hookName] = hooks[hookName] || [];
            hooks[hookName].push(handler);
        },
        executeHook: function(hookName, params, defaultFunc){
            var hooks = Registry.get('hooks');
            var executeDefault = true;
            if(hooks[hookName]){
                _.each(hooks[hookName], function(f){
                    executeDefault = executeDefault && f.apply(null, params);
                });
            }
            if(executeDefault && defaultFunc){
                    defaultFunc();
            }
        }
    }
});