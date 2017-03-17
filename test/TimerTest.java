import java.util.Timer;

public class TimerTest {
	public static void main(String[] args) {
		Timer timer = new Timer();
		timer.schedule(new TimerTaskTest(), 1000, 2000);
	}
}
