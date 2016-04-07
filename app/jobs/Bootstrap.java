package jobs;

import play.jobs.Job;
import play.jobs.OnApplicationStart;
import utils.SocketServer;

@OnApplicationStart
public class Bootstrap extends Job{
	
	@Override
	public void doJob() throws Exception {
		SocketServer socketServer = new SocketServer(8887);
    	socketServer.start();
	}
	

}
