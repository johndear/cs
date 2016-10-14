%{
    models = [];
    
    // 分组
    java.util.Set<String> categorySet = new java.util.HashSet<String>();
    
    for(controllerClass in play.Play.classloader.getAssignableClasses(_('controllers.CRUD'))) {
        resourceModel = _('controllers.CRUD$ObjectType').get(controllerClass)
        		
        annotation.Menu menu = controllerClass.getAnnotation(annotation.Menu.class);
        if (menu == null) {
            throw new Exception(controllerClass.name + "类缺少Menu注解定义！");
        }
        
        if(resourceModel != null) {
            categorySet.add(menu.category());
            resourceModel.categoryName = menu.category();
            models.add(resourceModel)
        }
    }
    for(controllerClass in play.Play.classloader.getAssignableClasses(_('play.scalasupport.crud.CRUDWrapper'))) {
        resourceModel = _('controllers.CRUD$ObjectType').get(controllerClass)
        if(resourceModel != null) {
            models.add(resourceModel)
        }
    }
    java.util.Collections.sort(models)
}%

%{ categorySet.eachWithIndex() { item, i -> }%
	%{
		attrs = [:]
		attrs.put('category', item)
	}%
    #{doBody vars:attrs /}
%{ } }%