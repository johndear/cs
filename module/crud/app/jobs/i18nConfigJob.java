package jobs;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.persistence.Entity;
import javax.persistence.Table;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;

import play.Play;
import play.classloading.ApplicationClasses;
import play.classloading.ApplicationClasses.ApplicationClass;
import play.db.jpa.Model;
import play.jobs.Job;
import play.jobs.OnApplicationStart;
import utils.MySQLTableComment;
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
					tableEntityMap.put(table.name(), ApplicationClasses.getJava(applicationClass.name).getName().replace(".java", "").toLowerCase());
				}else{
					tableEntityMap.put(applicationClass.name, ApplicationClasses.getJava(applicationClass.name).getName().replace(".java", "").toLowerCase());
				}
			}
		}
		
		List<String> conments = new ArrayList<String>();
		for (Entry entry : map.entrySet()) {
			String tableName = (String) entry.getKey();
			Map<String,Object> fieldMap = (Map<String, Object>) entry.getValue();
			for (Entry tableEntry : tableEntityMap.entrySet()) {
				if(tableEntry.getKey().equals(tableName)){
					for (Entry fieldEntry : fieldMap.entrySet()) {
						String key = tableEntry.getValue() + "." +  fieldEntry.getKey();
						String conment = (String) fieldEntry.getValue();
						conments.add(key + " = " + (StringUtils.isNotEmpty(conment) ? conment: key));
					}
				}
			}
			conments.add("\n");
		}
		
		FileUtils.writeLines(new File("e://test.txt"), conments);
		
	}

}
