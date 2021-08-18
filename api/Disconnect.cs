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
    public static class Disconnect
    {
        [FunctionName("Disconnect")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            string responseMessage = JsonConvert.SerializeObject(req.Headers);
            req.Headers.TryGetValue("X-MS-CLIENT-PRINCIPAL-ID", out var principalId);

            req.Headers.TryGetValue("X-MS-SWA-TOKENPROVIDER-ID", out var tokenProviderId);

            log.LogInformation($"principalId - {principalId}");
            
            ApiConnectionResource connection = null;

            var connectionId = principalId.ToString();
            log.LogInformation($"connectionId - {connectionId}");

            connection = await ConnectionManager.GetConnectionAsync(tokenProviderId, connectionId);

            if (connection != null) 
            {
                log.LogInformation("connection found!");
                await ConnectionManager.DeleteConnectionAsync(tokenProviderId, connectionId);
                return new OkResult();
            }
            else 
            {
                return new NotFoundResult();
            }     
        }
    }
}
