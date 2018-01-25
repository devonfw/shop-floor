Set IE = CreateObject("InternetExplorer.Application")
IE.navigate "http://localhost:8080/login"
IE.Visible = True

While IE.Busy
    WScript.Sleep 50
Wend

Set ipf = IE.document.all.username
ipf.Value = "cook" 
Set ipf = IE.document.all.password
ipf.Value = "cook" 
Set ipf = IE.document.all.Submit
ipf.Click

WScript.Sleep 500


Do While (IE.Busy)
   WScript.Sleep 50
 Loop  

IE.Navigate "http://localhost:8080/oasp4j-sample-server/services/rest/sampleservice/v1/hello", CLng(&h0800)
Set ipf = IE.Document.getElementByID("username")
ipf.Value = "cook" 
Set ipf = IE.Document.getElementByID("password")
ipf.Value = "cook" 
Set ipf = IE.Document.getElementByID("Submit")
ipf.Click
IE.Visible = True
