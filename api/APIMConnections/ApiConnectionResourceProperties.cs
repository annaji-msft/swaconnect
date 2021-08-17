using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace MSHA.ApiConnections
{
	public class ApiConnectionResourceProperties
	{
		[JsonProperty(PropertyName = "tenantId")]
		public string TenantId { get; set; }

		[JsonProperty(PropertyName = "Status")]
		public string Status { get; set; }

		[JsonProperty(PropertyName = "Error")]
		public Error Error { get; set; }
	}

	public class Error
	{
		[JsonProperty(PropertyName = "Code")]
		public string Code { get; set; }

		[JsonProperty(PropertyName = "Message")]
		public string Message { get; set; }
	}
}
