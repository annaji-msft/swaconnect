using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Net.Http;
using MSHA.ApiConnections;

namespace Company.Function
{
    public static class Invoke
    {
        [FunctionName("Invoke")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", "put", "patch", "delete", Route = null)] HttpRequest req,
            ILogger log)
        {
            var httpClient = new HttpClient();

            req.Headers.TryGetValue("X-MS-CLIENT-PRINCIPAL-ID", out var principalId);

            var connectionId = principalId.ToString();
            log.LogInformation($"connectionId - {connectionId}");

            string connectorName = req.Query["connector"];
            log.LogInformation($"connectorName - {connectorName}");

            string path = req.Query["path"];
            log.LogInformation($"path - {path}");
                
            var gatewayUrl =  Environment.GetEnvironmentVariable("APIMGATEWAYURL");
            var gatewayKey =  Environment.GetEnvironmentVariable("APIMKEY");

            log.LogInformation($"gatewayUrl - {gatewayUrl}");

            httpClient.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", gatewayKey);
            httpClient.DefaultRequestHeaders.Add("connector-id", connectorName);
            httpClient.DefaultRequestHeaders.Add("connection-id", connectionId);

            var connection = await ConnectionManager.GetConnectionAsync(connectorName, connectionId);

            if (connection != null && connection.Properties.Status.ToUpper().Equals("CONNECTED")) 
            {
                var runtimeURL = $"{gatewayUrl}/{connectorName}/{path}";
                log.LogInformation($"Calling Url - {runtimeURL}");

                var httpMethod = new HttpMethod(req.Method);
                using(var httpRequestMessage = new HttpRequestMessage(httpMethod, runtimeURL)) 
                {
                     if (req.ContentLength.GetValueOrDefault() > 0)
                    {
                        httpRequestMessage.Content = new StreamContent(req.Body);
                        httpRequestMessage.Content.Headers.ContentLength = req.ContentLength;

                        if (!string.IsNullOrEmpty(req.ContentType))
                        {
                            httpRequestMessage.Content.Headers.TryAddWithoutValidation("Content-Type", "application/json");
                        }
                    }

                    var result = await httpClient.SendAsync(httpRequestMessage);

                    return  new ContentResult { StatusCode =  (int)result.StatusCode, Content =  await result.Content.ReadAsStringAsync() };
                }
            }
            else 
            {
                return new BadRequestResult();
            }
        }
    }
}
