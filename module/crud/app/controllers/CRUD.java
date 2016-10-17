package controllers;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.persistence.Transient;

import models.TResource;

import org.apache.commons.lang.StringUtils;

import play.Logger;
import play.Play;
import play.data.binding.Binder;
import play.data.validation.MaxSize;
import play.data.validation.Password;
import play.data.validation.Required;
import play.db.Model;
import play.db.Model.Factory;
import play.db.jpa.GenericModel.JPAQuery;
import play.exceptions.TemplateNotFoundException;
import play.mvc.Before;
import play.mvc.Controller;
import play.mvc.Router;
import play.utils.Java;
import utils.Position;
import utils.ReflectUtils;
import annotation.Action;
import annotation.Menu;
import annotation.QueryParam;
import annotation.TableExclude;

public abstract class CRUD extends Controller {

    @Before
    public static void addType() throws Exception {
        ObjectType type = ObjectType.get(getControllerClass());
        renderArgs.put("type", type);
    }
    
    public static boolean newCrud = true;
    public static void layout() {
    	newCrud = true;
        render("custom/welcome.html");
    }

    public static void index() {
    	newCrud = false;
        if (getControllerClass() == CRUD.class) {
            forbidden();
        }
        render("CRUD/index.html");
    }

    public static void list(int page, String search, String searchFields, String orderBy, String order) {
//    	String where = (String) request.args.get("where");
//    	String where = params.get("where");
    	// liusu start
    	Map<String, String[]> objectParams = params.getRootParamNode().originalParams;
    	String where = "";
    	for (Entry entry : objectParams.entrySet()) {
    		String key = (String) entry.getKey();
    		String val = ((String[])entry.getValue())[0];
    		if(key.contains("object.") && StringUtils.isNotEmpty(val)){
    			where +=  key.replace("object.", "") + " like '%" + val + "%' and ";
    		}
    	}
    	where = StringUtils.isNotEmpty(where)? where.substring(0, where.lastIndexOf("and")) : null;
    	// liusu end
    	
        ObjectType type = ObjectType.get(getControllerClass());
        notFoundIfNull(type);
        if (page < 1) {
            page = 1;
        }
        List<Model> objects = type.findPage(page, search, searchFields, orderBy, order, where);
        Long count = type.count(search, searchFields, where);
        Long totalCount = type.count(null, null, where);
        try {
        	List<String> listFieldArr = new ArrayList<String>();
        	List<String> searchFieldArr = new ArrayList<String>();
        	Field[] fields = type.entityClass.getFields();
        	for (Field field : fields) {
        		Transient transientAnnotation = field.getAnnotation(Transient.class);
        		if(transientAnnotation != null && !"innerTableAction".equals(field.getName())){
        			continue;
        		}
        		TableExclude tableExclude = field.getAnnotation(TableExclude.class);
        		if(tableExclude==null){
        			listFieldArr.add(field.getName());
        		}
        		QueryParam queryParam = field.getAnnotation(QueryParam.class);
        		if(queryParam!=null){
        			searchFieldArr.add(field.getName());
        		}
			}
        	
        	if(listFieldArr.contains("id")){
        		listFieldArr.remove("id");
        	}
        	if(listFieldArr.contains("willBeSaved")){
        		listFieldArr.remove("willBeSaved");
        	}
        	
        	Class controllerClass = getControllerClass();
        	Method[] methods = ReflectUtils.getBeanPublicStaticMethods(controllerClass);
        	Map<String, String> outerTableAction = null;
        	Map<String, String> innerTableAction = null;
        	for (Method method : methods) {
        		if(",addType,index,layout,redirect,list,attachment,save,create,".contains(","+method.getName()+",")){
        			continue;
        		}
        		if(outerTableAction==null){
        			outerTableAction = new HashMap<String, String>();
        		}
        		if(innerTableAction==null){
        			innerTableAction = new HashMap<String, String>();
        		}
        		Action action = method.getAnnotation(Action.class);
        		String actionUrl = Router.getFullUrl(controllerClass.getName()+"."+method.getName());
        		if(action!=null && Position.INNER == action.position()){
        			innerTableAction.put(action.name(), actionUrl);
        		}else{
        			outerTableAction.put(action!=null ? action.name() : method.getName(), actionUrl);
        		}
			}
        	
        	Menu menu = getControllerClass().getAnnotation(Menu.class);
        	String menuCategory = "default";
        	if(StringUtils.isNotEmpty(menu.category())){
        		menuCategory = menu.category();
        	}
        	boolean isNew = newCrud;
            render(type, objects, count, totalCount, page, orderBy, order, searchFieldArr, listFieldArr, innerTableAction, outerTableAction, isNew, menuCategory);
        } catch (TemplateNotFoundException e) {
            render("CRUD/list.html", type, objects, count, totalCount, page, orderBy, order);
        }
    }

    @Action(code="show", name="编辑", position=Position.INNER)
    public static void show(String id) throws Exception {
        ObjectType type = ObjectType.get(getControllerClass());
        notFoundIfNull(type);
        Model object = type.findById(id);
        notFoundIfNull(object);
        try {
        	boolean isNew = newCrud;
            render(type, object, isNew);
        } catch (TemplateNotFoundException e) {
            render("CRUD/show.html", type, object);
        }
    }

    @SuppressWarnings("deprecation")
    public static void attachment(String id, String field) throws Exception {
        ObjectType type = ObjectType.get(getControllerClass());
        notFoundIfNull(type);
        Model object = type.findById(id);
        notFoundIfNull(object);
        Object att = object.getClass().getField(field).get(object);
        if(att instanceof Model.BinaryField) {
            Model.BinaryField attachment = (Model.BinaryField)att;
            if (attachment == null || !attachment.exists()) {
                notFound();
            }
            response.contentType = attachment.type();
            renderBinary(attachment.get(), attachment.length());
        }
        // DEPRECATED
        if(att instanceof play.db.jpa.FileAttachment) {
            play.db.jpa.FileAttachment attachment = (play.db.jpa.FileAttachment)att;
            if (attachment == null || !attachment.exists()) {
                notFound();
            }
            renderBinary(attachment.get(), attachment.filename);
        }
        notFound();
    }

    public static void save(String id) throws Exception {
        ObjectType type = ObjectType.get(getControllerClass());
        notFoundIfNull(type);
        Model object = type.findById(id);
        notFoundIfNull(object);
        Binder.bindBean(params.getRootParamNode(), "object", object);
        validation.valid(object);
        if (validation.hasErrors()) {
            renderArgs.put("error", play.i18n.Messages.get("crud.hasErrors"));
            try {
                render(request.controller.replace(".", "/") + "/show.html", type, object);
            } catch (TemplateNotFoundException e) {
                render("CRUD/show.html", type, object);
            }
        }
        object._save();
        flash.success(play.i18n.Messages.get("crud.saved", type.modelName));
        if (params.get("_save") != null) {
            redirect(request.controller + ".list");
        }
        redirect(request.controller + ".show", object._key());
    }

    @Action(code="blank", name="添加", position=Position.OUTER)
    public static void blank() throws Exception {
        ObjectType type = ObjectType.get(getControllerClass());
        notFoundIfNull(type);
        Constructor<?> constructor = type.entityClass.getDeclaredConstructor();
        constructor.setAccessible(true);
        Model object = (Model) constructor.newInstance();
        try {
        	boolean isNew = newCrud;
            render(type, object, isNew);
        } catch (TemplateNotFoundException e) {
            render("CRUD/blank.html", type, object);
        }
    }

    public static void create() throws Exception {
        ObjectType type = ObjectType.get(getControllerClass());
        notFoundIfNull(type);
        Constructor<?> constructor = type.entityClass.getDeclaredConstructor();
        constructor.setAccessible(true);
        Model object = (Model) constructor.newInstance();
        Binder.bindBean(params.getRootParamNode(), "object", object);
        validation.valid(object);
        if (validation.hasErrors()) {
            renderArgs.put("error", play.i18n.Messages.get("crud.hasErrors"));
            try {
                render(request.controller.replace(".", "/") + "/blank.html", type, object);
            } catch (TemplateNotFoundException e) {
                render("CRUD/blank.html", type, object);
            }
        }
        object._save();
        flash.success(play.i18n.Messages.get("crud.created", type.modelName));
        if (params.get("_save") != null) {
            redirect(request.controller + ".list");
        }
        if (params.get("_saveAndAddAnother") != null) {
            redirect(request.controller + ".blank");
        }
        redirect(request.controller + ".show", object._key());
    }

    @Action(code="delete", name="删除", position=Position.INNER)
    public static void delete(String id) throws Exception {
        ObjectType type = ObjectType.get(getControllerClass());
        notFoundIfNull(type);
        Model object = type.findById(id);
        notFoundIfNull(object);
        try {
            object._delete();
        } catch (Exception e) {
            flash.error(play.i18n.Messages.get("crud.delete.error", type.modelName));
            redirect(request.controller + ".show", object._key());
        }
        flash.success(play.i18n.Messages.get("crud.deleted", type.modelName));
        redirect(request.controller + ".list");
    }

    protected static ObjectType createObjectType(Class<? extends Model> entityClass) {
    	
        return new ObjectType(entityClass);
    }

    // ~~~~~~~~~~~~~
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE)
    public @interface For {
        Class<? extends Model> value();
    }

    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.FIELD)
    public @interface Exclude {}

    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.FIELD)
    public @interface Hidden {}

    // ~~~~~~~~~~~~~
    static int getPageSize() {
        return Integer.parseInt(Play.configuration.getProperty("crud.pageSize", "5"));
    }

    public static class ObjectType implements Comparable<ObjectType> {

        public Class<? extends Controller> controllerClass;
        public Class<? extends Model> entityClass;
        public String name;
        public String modelName;
        public String controllerName;
        public String keyName;
		public Factory factory;
		public String categoryName;
		public String showName;
		public int orderNo;

        public ObjectType(Class<? extends Model> modelClass) {
            this.modelName = modelClass.getSimpleName();
            this.entityClass = modelClass;
            this.factory = Model.Manager.factoryFor(entityClass);
            this.keyName = factory.keyName();
        }

        @SuppressWarnings("unchecked")
        public ObjectType(String modelClass) throws ClassNotFoundException {
            this((Class<? extends Model>) Play.classloader.loadClass(modelClass));
        }

        public static ObjectType forClass(String modelClass) throws ClassNotFoundException {
            return new ObjectType(modelClass);
        }

        public static ObjectType get(Class<? extends Controller> controllerClass) {
            Class<? extends Model> entityClass = getEntityClassForController(controllerClass);
            if (entityClass == null || !Model.class.isAssignableFrom(entityClass)) {
                return null;
            }
            ObjectType type;
            try {
                type = (ObjectType) Java.invokeStaticOrParent(controllerClass, "createObjectType", entityClass);
            } catch (Exception e) {
                Logger.error(e, "Couldn't create an ObjectType. Use default one.");
                type = new ObjectType(entityClass);
            }
            type.name = controllerClass.getSimpleName().replace("$", "");
            type.controllerName = controllerClass.getSimpleName().toLowerCase().replace("$", "");
            type.controllerClass = controllerClass;
            return type;
        }

        @SuppressWarnings("unchecked")
        public static Class<? extends Model> getEntityClassForController(Class<? extends Controller> controllerClass) {
            if (controllerClass.isAnnotationPresent(For.class)) {
                return controllerClass.getAnnotation(For.class).value();
            }
            for(Type it : controllerClass.getGenericInterfaces()) {
                if(it instanceof ParameterizedType) {
                    ParameterizedType type = (ParameterizedType)it;
                    if (((Class<?>)type.getRawType()).getSimpleName().equals("CRUDWrapper")) {
                        return (Class<? extends Model>)type.getActualTypeArguments()[0];
                    }
                }
            }
            String name = controllerClass.getSimpleName().replace("$", "");
            name = "models." + name.substring(0, name.length() - 1);
            try {
                return (Class<? extends Model>) Play.classloader.loadClass(name);
            } catch (ClassNotFoundException e) {
                return null;
            }
        }

        public Object getListAction() {
            return Router.reverse(controllerClass.getName().replace("$", "") + ".list");
        }

        public Object getBlankAction() {
            return Router.reverse(controllerClass.getName().replace("$", "") + ".blank");
        }

        public Long count(String search, String searchFields, String where) {

            return factory.count(searchFields == null ? new ArrayList<String>() : Arrays.asList(searchFields.split("[ ]")), search, where);
        }

        @SuppressWarnings("unchecked")
        public List<Model> findPage(int page, String search, String searchFields, String orderBy, String order, String where) {
            int offset = (page - 1) * getPageSize();
            List<String> properties = searchFields == null ? new ArrayList<String>(0) : Arrays.asList(searchFields.split("[ ]"));
            return Model.Manager.factoryFor(entityClass).fetch(offset, getPageSize(), orderBy, order, properties, search, where);
        }

        public Model findById(String id) throws Exception {
            if (id == null) {
                return null;
            }

            Factory factory =  Model.Manager.factoryFor(entityClass);
            Object boundId = Binder.directBind(id, factory.keyType());
            return factory.findById(boundId);
        }


        public List<ObjectField> getFields() {
            List<ObjectField> fields = new ArrayList<ObjectField>();
            List<ObjectField> hiddenFields = new ArrayList<ObjectField>();
            for (Model.Property f : factory.listProperties()) {
                ObjectField of = new ObjectField(f);
                if (of.type != null) {
                    if (of.type.equals("hidden")) {
                        hiddenFields.add(of);
                    } else {
                        fields.add(of);
                    }
                }
            }

            hiddenFields.addAll(fields);
            return hiddenFields;
        }

        public ObjectField getField(String name) {
            for (ObjectField field : getFields()) {
                if (field.name.equals(name)) {
                    return field;
                }
            }
            return null;
        }

        @Override
        public int compareTo(ObjectType other) {
        	 // liusu 逻辑跟bootstrap job保持一致。用于菜单排序
            Menu menu = controllerClass.getAnnotation(Menu.class);
            CRUD.For foran = controllerClass.getAnnotation(CRUD.For.class);
            Class<? extends Model> entityClass = getEntityClassForController(controllerClass);
            String menuCode = StringUtils.isNotEmpty(menu.code()) ? menu.code() : (foran==null ? entityClass.getSimpleName():foran.value().getSimpleName()); 
//            List list=TResource.findAll();
            
//            JPAQuery jpaquery = TResource.find("code=?", "TUser");
//  	      if(jpaquery!=null){
//  	      	TResource resource = jpaquery.first();
//  	      	int orderNo = resource!=null ? resource.orderNo : 0;
//  	      }
//            Factory factory =  Model.Manager.factoryFor(entityClass);
//            List<Model> list = factory.fetch(0, 1, null, null, new ArrayList<String>(0), null, null);
            
//            orderNo = TResource.setOrderNo(menuCode);
            return String.valueOf(orderNo).compareTo(String.valueOf(other.orderNo));
        }

        @Override
        public String toString() {
            return modelName;
        }

        public static class ObjectField {

            private Model.Property property;
            public String type = "unknown";
            public String name;
            public boolean multiple;
            public boolean required;

            @SuppressWarnings("deprecation")
            public ObjectField(Model.Property property) {
                Field field = property.field;
                this.property = property;
                if (CharSequence.class.isAssignableFrom(field.getType())) {
                    type = "text";
                    if (field.isAnnotationPresent(MaxSize.class)) {
                        int maxSize = field.getAnnotation(MaxSize.class).value();
                        if (maxSize > 100) {
                            type = "longtext";
                        }
                    }
                    if (field.isAnnotationPresent(Password.class)) {
                        type = "password";
                    }
                }
                if (Number.class.isAssignableFrom(field.getType()) || field.getType().equals(double.class) || field.getType().equals(int.class) || field.getType().equals(long.class)) {
                    type = "number";
                }
                if (Boolean.class.isAssignableFrom(field.getType()) || field.getType().equals(boolean.class)) {
                    type = "boolean";
                }
                if (Date.class.isAssignableFrom(field.getType())) {
                    type = "date";
                }
                if (property.isRelation) {
                    type = "relation";
                }
                if (property.isMultiple) {
                    multiple = true;
                }
                if(Model.BinaryField.class.isAssignableFrom(field.getType()) || /** DEPRECATED **/ play.db.jpa.FileAttachment.class.isAssignableFrom(field.getType())) {
                    type = "binary";
                }
                if (field.getType().isEnum()) {
                    type = "enum";
                }
                if (property.isGenerated) {
                    type = null;
                }
                if (field.isAnnotationPresent(Required.class)) {
                    required = true;
                }
                if (field.isAnnotationPresent(Hidden.class)) {
                    type = "hidden";
                }
                if (field.isAnnotationPresent(Exclude.class)) {
                    type = null;
                }
                if (java.lang.reflect.Modifier.isFinal(field.getModifiers())) {
                    type = null;
                }
                name = field.getName();
            }

            public List<Object> getChoices() {
                return property.choices.list();
            }
        }
    }
}

