package knu_24_1_team10.webosgardening.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.client.write.Point;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;


@Repository
public class InfluxDBRepository {
  @Autowired
  private InfluxDBClient influxDBClient;

  @Value("${custom.influxdb.bucket}")
	private String bucket;

  @Value("${custom.influxdb.org}")
	private String org;
  
  private String waterMeasurementName = "plants_water_monitoring_data";
  private String lightMeasurementName = "plants_light_monitoring_data";
  private String temperatureMeasurementName = "plants_temperature_monitoring_data";
  private String humidityMeasurementName = "plants_humidity_monitoring_data";
  private String co2MeasurementName = "plants_co2_monitoring_data";

  // monitoring 데이터 저장하는 함수들 -> 물, 광량, 온도, 습도, 이산화탄소
  public void saveWaterValue(Long userId, Long plantId, float water, Long unixTime) {
    Point point = Point.measurement(waterMeasurementName)
                     .addTag("plantId", Long.toString(plantId))
                     .addTag("userId", Long.toString(userId))
                     .addField("water", water)
                     .time(unixTime, WritePrecision.S);
    influxDBClient.getWriteApiBlocking().writePoint(point);
  }
  public void saveLightValue(Long userId, Long plantId, float light, Long unixTime) {
    Point point = Point.measurement(lightMeasurementName)
                     .addTag("plantId", Long.toString(plantId))
                     .addTag("userId", Long.toString(userId))
                     .addField("light", light)
                     .time(unixTime, WritePrecision.S);
    influxDBClient.getWriteApiBlocking().writePoint(point);
  }
  public void saveTemperatureValue(Long userId, Long plantId, float temperature, Long unixTime) {
    Point point = Point.measurement(temperatureMeasurementName)
                     .addTag("plantId", Long.toString(plantId))
                     .addTag("userId", Long.toString(userId))
                     .addField("temperature", temperature)
                     .time(unixTime, WritePrecision.S);
    influxDBClient.getWriteApiBlocking().writePoint(point);
  }
  public void saveHumidityValue(Long userId, Long plantId, float humidity, Long unixTime) {
    Point point = Point.measurement(humidityMeasurementName)
                     .addTag("plantId", Long.toString(plantId))
                     .addTag("userId", Long.toString(userId))
                     .addField("humidity", humidity)
                     .time(unixTime, WritePrecision.S);
    influxDBClient.getWriteApiBlocking().writePoint(point);
  }
  public void saveCo2Value(Long userId, Long plantId, float co2, Long unixTime) {
    Point point = Point.measurement(co2MeasurementName)
                     .addTag("plantId", Long.toString(plantId))
                     .addTag("userId", Long.toString(userId))
                     .addField("co2", co2)
                     .time(unixTime, WritePrecision.S);
    influxDBClient.getWriteApiBlocking().writePoint(point);
  }

  // monitoring 데이터 조회하는 함수들
  // 특정 식물의 가장 최근 모니터링 데이터 조회
  public Optional<Float> findLatestWaterValue(Long plantId) {
    String query = String.format("""
      from(bucket: "%s")
      |> range(start: -24h)
      |> filter(fn: (r) => r._measurement == "%s")
      |> filter(fn: (r) => r.plantId == "%d")
      |> last()
      """, bucket, waterMeasurementName, plantId);
    List<FluxTable> resultList = influxDBClient.getQueryApi().query(query, org);
    if (resultList.isEmpty() || resultList.get(0).getRecords().isEmpty())
      return Optional.empty();
    FluxRecord record = resultList.get(0).getRecords().get(0);
    Object value = record.getValue();
    if (value == null)
      return Optional.empty();
    return Optional.of(Float.parseFloat(value.toString()));
  }
  public Optional<Float> findLatestLightValue(Long plantId) {
    String query = String.format("""
      from(bucket: "%s")
      |> range(start: -24h)
      |> filter(fn: (r) => r._measurement == "%s")
      |> filter(fn: (r) => r.plantId == "%d")
      |> last()
      """, bucket, lightMeasurementName, plantId);
    List<FluxTable> resultList = influxDBClient.getQueryApi().query(query, org);
    if (resultList.isEmpty() || resultList.get(0).getRecords().isEmpty())
      return Optional.empty();
    FluxRecord record = resultList.get(0).getRecords().get(0);
    Object value = record.getValue();
    if (value == null)
      return Optional.empty();
    return Optional.of(Float.parseFloat(value.toString()));
  }
  public Optional<Float> findLatestTemperatureValue(Long plantId) {
    String query = String.format("""
      from(bucket: "%s")
      |> range(start: -24h)
      |> filter(fn: (r) => r._measurement == "%s")
      |> filter(fn: (r) => r.plantId == "%d")
      |> last()
      """, bucket, temperatureMeasurementName, plantId);
    List<FluxTable> resultList = influxDBClient.getQueryApi().query(query, org);
    if (resultList.isEmpty() || resultList.get(0).getRecords().isEmpty())
      return Optional.empty();
    FluxRecord record = resultList.get(0).getRecords().get(0);
    Object value = record.getValue();
    if (value == null)
      return Optional.empty();
    return Optional.of(Float.parseFloat(value.toString()));
  }
  public Optional<Float> findLatestHumidityValue(Long plantId) {
    String query = String.format("""
      from(bucket: "%s")
      |> range(start: -24h)
      |> filter(fn: (r) => r._measurement == "%s")
      |> filter(fn: (r) => r.plantId == "%d")
      |> last()
      """, bucket, humidityMeasurementName, plantId);
    List<FluxTable> resultList = influxDBClient.getQueryApi().query(query, org);
    if (resultList.isEmpty() || resultList.get(0).getRecords().isEmpty())
      return Optional.empty();
    FluxRecord record = resultList.get(0).getRecords().get(0);
    Object value = record.getValue();
    if (value == null)
      return Optional.empty();
    return Optional.of(Float.parseFloat(value.toString()));
  }
  public Optional<Float> findLatestCo2Value(Long plantId) {
    String query = String.format("""
      from(bucket: "%s")
      |> range(start: -24h)
      |> filter(fn: (r) => r._measurement == "%s")
      |> filter(fn: (r) => r.plantId == "%d")
      |> last()
      """, bucket, co2MeasurementName, plantId);
    List<FluxTable> resultList = influxDBClient.getQueryApi().query(query, org);
    if (resultList.isEmpty() || resultList.get(0).getRecords().isEmpty())
      return Optional.empty();
    FluxRecord record = resultList.get(0).getRecords().get(0);
    Object value = record.getValue();
    if (value == null)
      return Optional.empty();
    return Optional.of(Float.parseFloat(value.toString()));
  }

  // 특정 식물의 특정 날짜 평균 수분 추출 함수
  public Optional<Float> findWaterMeanValueByDate(Long plantId, int year, int month, int day) {
    String startDate = String.format("%d-%02d-%02dT00:00:00Z", year, month, day);
    String endDate = String.format("%d-%02d-%02dT23:59:59Z", year, month, day);

    String query = String.format("""
      from(bucket: "%s")
      |> range(start: %s, stop: %s)
      |> filter(fn: (r) => r._measurement == "%s")
      |> filter(fn: (r) => r.plantId == "%d")
      |> mean()
      """, bucket, startDate, endDate, waterMeasurementName, plantId);
    List<FluxTable> resultList = influxDBClient.getQueryApi().query(query, org);
    if (resultList.isEmpty() || resultList.get(0).getRecords().isEmpty())
      return Optional.empty();
    FluxRecord record = resultList.get(0).getRecords().get(0);
    Object value = record.getValue();
    if (value == null)
      return Optional.empty();
    return Optional.of(Float.parseFloat(value.toString()));
  }
}