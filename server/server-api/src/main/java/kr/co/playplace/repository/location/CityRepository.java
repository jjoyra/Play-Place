package kr.co.playplace.repository.location;

import kr.co.playplace.entity.location.City;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CityRepository extends JpaRepository<City, Integer> {
}
