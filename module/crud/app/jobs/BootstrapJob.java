package jobs;

import play.i18n.Lang;
import models.Event;
import models.EventType;
import play.Logger;
import play.jobs.Job;
import play.jobs.OnApplicationStart;
import play.test.Fixtures;

@OnApplicationStart
public class BootstrapJob extends Job {

	@Override
	public void doJob() {
		Lang.set("zh");//设置为中文  
		
//		Fixtures.deleteAllModels();
		Fixtures.loadModels("data-" + Lang.get() + ".yml");

		Logger.info("ran BootstrapJob, %s events loaded, %s types loaded", Event.count(), EventType.count());
	}
	
}