import static org.junit.Assert.assertEquals;

import java.io.IOException;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.impl.client.HttpClientBuilder;
import org.junit.Test;

/**
 * @author ssarmoka
 *
 */
public class TestSampleRestService {

  @Test
  public void testLogin() {

    HttpUriRequest request = new HttpGet("http://localhost:8081/login");
    request.addHeader("username", "cook");
    request.addHeader("password", "cook");

    try {
      HttpResponse httpResponse = HttpClientBuilder.create().build().execute(request);
      HttpEntity output = httpResponse.getEntity();

      assertEquals(200, httpResponse.getStatusLine().getStatusCode());

    } catch (ClientProtocolException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    } catch (IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }

  }
}
