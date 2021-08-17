using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MSHA.ApiConnections
{
    public interface IApiConnectionDataProvider
    {
       Task<ApiConnectionResource> CreateConnectionAsync(
			string accessToken,
			string subscriptionId,
			string resourceGroupId,
			string serviceName,
			string tokenProviderName,
			string connectionName,
			string tenantId);
        
         Task<ApiConnectionResource> GetConnectionAsync(
			string accessToken,
			string subscriptionId,
			string resourceGroupId,
			string serviceName,
			string tokenProviderName,
			string connectionName);

        Task<ApiConnectionConsentLinkResponse> GetConsentLinkAsync(
			string accessToken, 
			string subscriptionId, 
			string resourceGroupId, 
			string serviceName,
			string tokenProviderName,
			string connectionName, 
			string redirectUrl);

        Task<object> DeleteConnectionAsync(
			string accessToken,
			string subscriptionId,
			string resourceGroupId,
			string serviceName,
			string tokenProviderName,
			string connectionName);
    }
}
