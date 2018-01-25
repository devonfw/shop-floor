
import javax.inject.Named;
import javax.ws.rs.core.Response;

@Named("SampleRestService")
public class SampleRestServiceImpl implements SampleRestService {

  @Override
  public Response sayHello() {

    return Response.status(200).entity("Hello World!!!").build();

  }

}
