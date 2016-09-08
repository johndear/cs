package jobs;

import play.jobs.Job;
import play.jobs.OnApplicationStart;
import utils.MySQLTableComment;

@OnApplicationStart
public class i18nConfigJob extends Job {
	
	@Override
	public void doJob() throws Exception {
		MySQLTableComment.getColumnCommentByTableName(MySQLTableComment.getAllTableName());
	}

}
