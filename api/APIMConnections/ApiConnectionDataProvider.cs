using System;
using System.Collections.Specialized;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Security.Cryptography;

namespace MSHA.ApiConnections
{
	public class ApiConnectionDataProvider : AzureResourceManagerDataProvider, IApiConnectionDataProvider
	{
		public ApiConnectionDataProvider(IDiagnosticsTracing logger, HttpClient httpClient)
			: base(logger, httpClient)
		{
		}

		private static Uri ListTokenProvidersUri(
			string subscriptionId, 
			string resourceGroupName, 
			string serviceName)
		{
			return new Uri(
				baseUri: AzureResourceManagerDataProvider.AzureResourceManagerApiEndpoint,
				relativeUri: $"subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ApiManagement/service/{serviceName}/tokenProviders?api-version=2021-04-01-preview");
		}

		private static Uri GetCreateApiConnectionUri(
			string subscriptionId, 
			string resourceGroupName, 
			string serviceName,
			string tokenProviderName,
			string connectionName)
		{
			return new Uri(
				baseUri: AzureResourceManagerDataProvider.AzureResourceManagerApiEndpoint,
				relativeUri: $"subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ApiManagement/service/{serviceName}/tokenProviders/{tokenProviderName}/connections/{connectionName}?api-version=2021-04-01-preview");
		}

		private static Uri GetConsentLinksApiConnectionUri(
			string subscriptionId, 
			string resourceGroupName, 
			string serviceName,
			string tokenProviderName,
			string connectionName)
		{
			return new Uri(
				baseUri: AzureResourceManagerDataProvider.AzureResourceManagerApiEndpoint,
				relativeUri: $"subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ApiManagement/service/{serviceName}/tokenProviders/{tokenProviderName}/connections/{connectionName}/getLoginLinks?api-version=2021-04-01-preview");
		}

		public async Task<AzureResourceList<TokenProviderResource>> ListTokenProvidersAsync(
			string accessToken,
			string subscriptionId,
			string resourceGroupId,
			string serviceName)
		{
			//subscriptionId.CheckArgumentForNullOrWhiteSpace(nameof(subscriptionId));
			//resourceGroupId.CheckArgumentForNullOrWhiteSpace(nameof(resourceGroupId));
			//location.CheckArgumentForNullOrWhiteSpace(nameof(location));
			//connectorType.CheckArgumentForNullOrWhiteSpace(nameof(connectorType));

			 var requestUri = ApiConnectionDataProvider.ListTokenProvidersUri(
				subscriptionId,
				resourceGroupId,
				serviceName);

			//TODO: need to add request content (body.json)
			var result = await base.CallAzureResourceManagerAsync<AzureResourceList<TokenProviderResource>>(
				accessToken: accessToken,
				requestUri: requestUri,
				httpMethod: HttpMethod.Get)
				.ConfigureAwait(continueOnCapturedContext: false);

			if (!result.HttpStatusCode.IsSuccessfulRequest())
			{
				throw new InvalidOperationException(
					message: string.Format("Call to get connection failed with '{0}'", result.Error));
			}

			return result.Response;
		}

		public async Task<ApiConnectionResource> CreateConnectionAsync(
			string accessToken,
			string subscriptionId,
			string resourceGroupId,
			string serviceName,
			string tokenProviderName,
			string connectionName,
			string tenantId)
		{
			//subscriptionId.CheckArgumentForNullOrWhiteSpace(nameof(subscriptionId));
			//resourceGroupId.CheckArgumentForNullOrWhiteSpace(nameof(resourceGroupId));
			//location.CheckArgumentForNullOrWhiteSpace(nameof(location));
			//connectorType.CheckArgumentForNullOrWhiteSpace(nameof(connectorType));

			 var requestUri = ApiConnectionDataProvider.GetCreateApiConnectionUri(
				subscriptionId,
				resourceGroupId,
				serviceName,
				tokenProviderName,
				connectionName);

			var requestContent = new ApiConnectionResource 
			{ 
			 	Properties = new ApiConnectionResourceProperties 
				{ 
					TenantId = tenantId
				}
			};

			//TODO: need to add request content (body.json)
			var result = await base.CallAzureResourceManagerAsync<ApiConnectionResource, ApiConnectionResource>(
				accessToken: accessToken,
				requestUri: requestUri,
				httpMethod: HttpMethod.Put,
				requestContent: requestContent)
				.ConfigureAwait(continueOnCapturedContext: false);

			if (!result.HttpStatusCode.IsSuccessfulRequest())
			{
				throw new InvalidOperationException(
					message: string.Format("Call to create connection failed with '{0}'", result.Error));
			}

			return result.Response;
		}

		public async Task<ApiConnectionResource> GetConnectionAsync(
			string accessToken,
			string subscriptionId,
			string resourceGroupId,
			string serviceName,
			string tokenProviderName,
			string connectionName)
		{
			//subscriptionId.CheckArgumentForNullOrWhiteSpace(nameof(subscriptionId));
			//resourceGroupId.CheckArgumentForNullOrWhiteSpace(nameof(resourceGroupId));
			//location.CheckArgumentForNullOrWhiteSpace(nameof(location));
			//connectorType.CheckArgumentForNullOrWhiteSpace(nameof(connectorType));

			 var requestUri = ApiConnectionDataProvider.GetCreateApiConnectionUri(
				subscriptionId,
				resourceGroupId,
				serviceName,
				tokenProviderName,
				connectionName);

			//TODO: need to add request content (body.json)
			var result = await base.CallAzureResourceManagerAsync<ApiConnectionResource>(
				accessToken: accessToken,
				requestUri: requestUri,
				httpMethod: HttpMethod.Get)
				.ConfigureAwait(continueOnCapturedContext: false);

			// This should be NotFound
			if(result.HttpStatusCode == HttpStatusCode.BadRequest) return null;

			if (!result.HttpStatusCode.IsSuccessfulRequest())
			{
				throw new InvalidOperationException(
					message: string.Format("Call to get connection failed with '{0}'", result.Error));
			}

			return result.Response;
		}

		public async Task<ApiConnectionConsentLinkResponse> GetConsentLinkAsync(
			string accessToken, 
			string subscriptionId, 
			string resourceGroupId, 
			string serviceName,
			string tokenProviderName,
			string connectionName, 
			string redirectUrl)
		{
			//subscriptionId.CheckArgumentForNullOrWhiteSpace(nameof(subscriptionId));
			//resourceGroupId.CheckArgumentForNullOrWhiteSpace(nameof(resourceGroupId));
			//connectorType.CheckArgumentForNullOrWhiteSpace(nameof(connectorType));

			var requestUri = ApiConnectionDataProvider.GetConsentLinksApiConnectionUri(
				subscriptionId,
				resourceGroupId,
				serviceName,
				tokenProviderName,
				connectionName);

			var requestContent = new ApiConnectionConsentLink();
			var parameter = new Parameters();
			parameter.ParameterName = "token";
			parameter.RedirectUrl = redirectUrl;
			requestContent.Parameters = new Parameters[] { parameter };

			var result = await base.CallAzureResourceManagerAsync<ApiConnectionConsentLink, ApiConnectionConsentLinkResponse>(
				accessToken: accessToken,
				requestUri: requestUri,
				httpMethod: HttpMethod.Post,
				requestContent: requestContent)
				.ConfigureAwait(continueOnCapturedContext: false);

			if (!result.HttpStatusCode.IsSuccessfulRequest())
			{
				throw new InvalidOperationException(
					message: string.Format("Call to get consent link failed with '{0}'", result.Error));
			}

			return result.Response;
		}

		public async Task<object> DeleteConnectionAsync(
			string accessToken,
			string subscriptionId,
			string resourceGroupId,
			string serviceName,
			string tokenProviderName,
			string connectionName)
		{
			var requestUri = ApiConnectionDataProvider.GetCreateApiConnectionUri(
			   subscriptionId,
			   resourceGroupId,
			   serviceName,
			   tokenProviderName,
			   connectionName);

			//TODO: need to add request content (body.json)
			var result = await base.CallAzureResourceManagerAsync(
				accessToken: accessToken,
				requestUri: requestUri,
				httpMethod: HttpMethod.Delete)
				.ConfigureAwait(continueOnCapturedContext: false);

			if (!result.HttpStatusCode.IsSuccessfulRequest())
			{
				throw new InvalidOperationException(
					message: string.Format("Call to create connection failed with '{0}'", result.Error));
			}

			return result.Response;
		}

	}
}
