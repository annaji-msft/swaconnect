using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using MSHA.ApiConnections;

namespace Company.Function
{
    public static class Connect
    {
        [FunctionName("Connect")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            string responseMessage = JsonConvert.SerializeObject(req.Headers);
            req.Headers.TryGetValue("X-MS-CLIENT-PRINCIPAL-ID", out var principalId);
            req.Headers.TryGetValue("X-MS-ORIGINAL-URL", out var swaUrl);
            req.Headers.TryGetValue("X-MS-TOKENPROVIDER-ID", out var tokenProviderId);

            var redirectUrl = swaUrl.ToString().Replace("/api/Connect", string.Empty);

            log.LogInformation($"principalId - {principalId}");
            log.LogInformation($"swaurl - {swaUrl}");
            log.LogInformation($"redirecturl - {redirectUrl}");
            
            ApiConnectionResource connection = null;

            var connectionId = principalId.ToString();
            log.LogInformation($"connectionId - {connectionId}");

            connection = await ConnectionManager.GetConnectionAsync(tokenProviderId, connectionId);

            if (connection == null) 
            {
                log.LogInformation("connection not found!");
                connection = await ConnectionManager.CreateConnectionAsync(tokenProviderId, connectionId, "72f988bf-86f1-41af-91ab-2d7cd011db47");
                
                var consentLinks = await ConnectionManager.GetConsentLinkAsync(tokenProviderId, connectionId, redirectUrl);
                return new ContentResult { Content =  consentLinks.Value[0].Link, StatusCode =  401 };
            } 
            else if (connection.Properties.Status.ToUpper().Equals("ERROR")) 
            {
                log.LogInformation("connection found but not authenticated!");
                var consentLinks = await ConnectionManager.GetConsentLinkAsync(tokenProviderId, connectionId, redirectUrl);
                return new ContentResult { Content =  consentLinks.Value[0].Link, StatusCode =  401 };
            } 
            else 
            {
                 log.LogInformation("connection found and authenticated!");
                return new OkObjectResult("Success!");
            }     
        }
    }
}
