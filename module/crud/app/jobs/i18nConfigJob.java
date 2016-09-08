package jobs;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.persistence.Entity;
import javax.persistence.Table;

import play.Play;
import play.classloading.ApplicationClasses.ApplicationClass;
import play.db.jpa.Model;
import play.jobs.Job;
import play.jobs.OnApplicationStart;
import play.mvc.Controller;
import utils.MySQLTableComment;
import utils.Rest;
import utils.StringUtil;

@OnApplicationStart
public class i18nConfigJob extends Job {
	
	@Override
	public void doJob() throws Exception {
		Map<String, Map<String,Object>> map = MySQLTableComment.getColumnCommentByTableName(MySQLTableComment.getAllTableName());
		
		Map<String,String> tableEntityMap =new HashMap<String,String>(); 
		List<ApplicationClass> clazzes = Play.classes.getAssignableClasses(Model.class);
		for (ApplicationClass applicationClass : clazzes) {
			Entity entity = applicationClass.javaClass.getAnnotation(Entity.class);
			if(entity!=null){
				Table table = applicationClass.javaClass.getAnnotation(Table.class);
				if(table!=null){
					tableEntityMap.put(table.name(), StringUtil.toLowerCaseFirstOne(applicationClass.name));
				}else{
					tableEntityMap.put(applicationClass.name, StringUtil.toLowerCaseFirstOne(applicationClass.name));
				}
			}
		}
		for (Entry entry : map.entrySet()) {
			String tableName = (String) entry.getKey();
			Map<String,Object> fieldMap = (Map<String, Object>) entry.getValue();
			for (Entry tableEntry : tableEntityMap.entrySet()) {
				if(tableEntry.getKey().equals(tableName)){
					for (Entry fieldEntry : fieldMap.entrySet()) {
						String key = tableEntry.getValue() + "." +  fieldEntry.getKey();
						String conment = (String) fieldEntry.getValue();
						System.out.println(key+"----"+conment);
					}
				}
			}
			
		}
	}

}
