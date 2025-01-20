package Main.Repository.Bong;

import org.springframework.data.jpa.repository.JpaRepository;

import Main.DTO.Bong.BongPlace;

public interface BongPlaceRepository extends JpaRepository<BongPlace, Integer> {}
