import javax.inject.Named;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/sampleservice/v1")
@Named("SampleRestService")
@Produces(MediaType.TEXT_PLAIN)
public interface SampleRestService extends RestService {

  @GET
  @Path("/hello")
  Response sayHello();
}
