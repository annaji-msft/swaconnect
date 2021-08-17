using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace MSHA.ApiConnections
{
	public class ApiConnectionConsentLinkResponse
	{
		[JsonProperty(PropertyName = "Value")]
		public Value[] Value { get; set; }
	}

	public class Value
	{
		[JsonProperty(PropertyName = "DisplayName")]
		public string DisplayName { get; set; }

		[JsonProperty(PropertyName = "FirstPartyLoginUri")]
		public string FirstPartyLoginUri { get; set; }

		[JsonProperty(PropertyName = "Link")]
		public string Link { get; set; }

		[JsonProperty(PropertyName = "Status")]
		public string Status { get; set; }
	}
}
