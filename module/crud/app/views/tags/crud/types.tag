%{
    models = [];
    
    for(controllerClass in play.Play.classloader.getAssignableClasses(_('controllers.CRUD'))) {
        resourceModel = _('controllers.CRUD$ObjectType').get(controllerClass)
        		
        if(resourceModel != null) {
	        utils.Menu menu = controllerClass.getAnnotation(utils.Menu.class);
            resourceModel.showName = menu.name();
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

%{ models.eachWithIndex() { item, i -> }%
	%{
		attrs = [:]
		attrs.put('type', item)
	}%
    #{doBody vars:attrs /}
%{ } }%