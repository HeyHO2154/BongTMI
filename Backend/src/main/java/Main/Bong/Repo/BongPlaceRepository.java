package Main.Bong.Repo;

import org.springframework.data.jpa.repository.JpaRepository;

import Main.Bong.DTO.BongPlace;

public interface BongPlaceRepository extends JpaRepository<BongPlace, Integer> {}
