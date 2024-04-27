package knu_24_1_team10.webosgardening;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;

@Configuration
public class influxDBConfiguration {
  @Value("${custom.influxdb.url}")
	private String url;

	@Value("${custom.influxdb.token}")
	private char[] token;

	@Value("${custom.influxdb.org}")
	private String org;

	@Value("${custom.influxdb.bucket}")
	private String bucket;

	@Bean
	public InfluxDBClient influxDBClient() {
		return InfluxDBClientFactory.create(url, token, org, bucket);
	}
}
