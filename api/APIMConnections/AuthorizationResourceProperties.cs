using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace MSHA.ApiConnections
{
	public class AuthorizationResourceProperties
	{
		[JsonProperty(PropertyName = "status")]
		public string Status { get; set; }

		[JsonProperty(PropertyName = "error")]
		public Error Error { get; set; }
	}

	public class Error
	{
		[JsonProperty(PropertyName = "code")]
		public string Code { get; set; }

		[JsonProperty(PropertyName = "message")]
		public string Message { get; set; }
	}
}
