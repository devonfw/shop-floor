import static com.jayway.restassured.RestAssured.given;
import static org.hamcrest.Matchers.containsString;

import org.junit.Test;
import org.springframework.test.annotation.DirtiesContext;

/**
 * @author ssarmoka
 *
 */
public class TestSampleRestService {

  @Test
  @DirtiesContext
  public void testHello() {

    final String uri = "http://localhost:8081/oasp4j-sample-server/services/rest/sampleservice/v1/hello";

    given().when().get(uri).then().body(containsString("Hello World!!!"));
  }
}
