using Newtonsoft.Json;

namespace MSHA.ApiConnections
{
	public class ApiConnectionConsentLink
	{
		[JsonProperty(PropertyName = "Parameters")]
		public Parameters[] Parameters { get; set; }
	}

	public class Parameters
	{
		[JsonProperty(PropertyName = "ParameterName")]
		public string ParameterName { get; set; }

		[JsonProperty(PropertyName = "RedirectUrl")]
		public string RedirectUrl { get; set; }
	}
}
