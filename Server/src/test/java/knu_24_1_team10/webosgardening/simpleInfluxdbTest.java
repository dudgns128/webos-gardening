package knu_24_1_team10.webosgardening;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import knu_24_1_team10.webosgardening.repository.InfluxDBRepository;

// InfluxDB Repository 코드 짠거 잘 돌아가는지 그냥 간단하게 테스트..
// 확실히 test용 DB가 따로 있긴 해야 할 듯, RDB처럼 @Transactional도 안되고..

@SpringBootTest
public class simpleInfluxdbTest {
  @Autowired InfluxDBRepository influxDBRepository;

  @BeforeEach
  public void beforeEach() {
    influxDBRepository.saveWaterValue(9999999L, 9999998L, 7.5F, (Long) System.currentTimeMillis() / 1000);
    influxDBRepository.saveWaterValue(9999999L, 9999999L, 12.5F, 1000000000L);
    influxDBRepository.saveWaterValue(9999999L, 9999999L, 12.5F, 1000000005L);
  }

  @Test
  public void monitoringDataInsertSelectTest() {
    Optional<Float> findWater_Optional = influxDBRepository.findLatestWaterValue(9999998L);
    if (findWater_Optional.isEmpty())
      fail("모니터링 데이터 조회 실패");
		float findWater = findWater_Optional.get();
		assertEquals(7.5F, findWater);
  }

  @Test
  public void monitoringDataMeanValueTest() {
    Optional<Float> findWater_Optional = influxDBRepository.findWaterMeanValueByDate(78999L, 2001, 9, 9);
    if (findWater_Optional.isEmpty())
      fail("모니터링 데이터 평균값 조회 실패");
		float findWater = findWater_Optional.get();
		assertEquals(12.5F, findWater);
  }
}
