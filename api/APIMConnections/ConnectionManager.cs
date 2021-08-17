using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace MSHA.ApiConnections
{
	public class ConnectionManager
	{
		public static string subscriptionId;

		public static string resourceGroupId;

		public static string serviceName;

		public static IDiagnosticsTracing logger;
		public static HttpClient httpClient;
		public static IAuthenticationDataProvider authenticationDataProvider;
		public static IApiConnectionDataProvider apiConnectionDataProvider;

		static ConnectionManager()
		{
			subscriptionId = "4f5285a3-9fd7-40ad-91b1-d8fc3823983d";
			serviceName = "anganti-preview";
			resourceGroupId = "anganti";

			logger = new NoopDiagnosticTracing();
			httpClient = new HttpClient();

			authenticationDataProvider = new ManagedIdentityDataProvider(GetManagedIdentitySettings(), logger);
			apiConnectionDataProvider = new ApiConnectionDataProvider(logger, httpClient);
		}

		private static ManagedIdentitySettings GetManagedIdentitySettings()
		{
			return new ManagedIdentitySettings
			{
				ClientId = "",
				ResourceEndpoint = "https://management.core.windows.net/",
			};
		}

		public static async Task<string> GetArmAccessToken()
		{
			return await authenticationDataProvider.GetAccessTokenAsync();
		}

		//change to take connection type and name
		public static async Task<ApiConnectionResource> CreateConnectionAsync(
			string tokenProviderName,
			string connectionName,
			string tenantId)
		{
			var accessToken = await GetArmAccessToken();

			var createdApiConnection = await apiConnectionDataProvider.CreateConnectionAsync(
				accessToken,
				subscriptionId,
				resourceGroupId,
				serviceName,
				tokenProviderName,
				connectionName, 
				tenantId);

			return createdApiConnection;
		}

		public static async Task<ApiConnectionResource> GetConnectionAsync(
			string tokenProviderName,
			string connectionName)
		{
			var accessToken = await GetArmAccessToken();

			var connection = await apiConnectionDataProvider.GetConnectionAsync(
				accessToken,
				subscriptionId,
				resourceGroupId,
				serviceName,
				tokenProviderName,
				connectionName);

			return connection;
		}

		public static async Task<ApiConnectionConsentLinkResponse> GetConsentLinkAsync(
			string tokenProviderName,
			string connectionName,
			string redirectUrl)
		{
			var accessToken = await GetArmAccessToken();

			var consentLinkResponse = await apiConnectionDataProvider.GetConsentLinkAsync(
				accessToken,
				subscriptionId,
				resourceGroupId,
				serviceName,
				tokenProviderName,
				connectionName, 
				redirectUrl);

			return consentLinkResponse;
		}

		public static async Task<object> DeleteConnectionAsync(
			string tokenProviderName,
			string connectionName)
		{
			var accessToken = await GetArmAccessToken();

			var deletedApiConnection = await apiConnectionDataProvider.DeleteConnectionAsync(
				accessToken,
				subscriptionId,
				resourceGroupId,
				serviceName,
				tokenProviderName,
				connectionName);

			return deletedApiConnection;
		}
	}
}
