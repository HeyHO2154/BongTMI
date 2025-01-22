package Main.Bong.Repo;

import org.springframework.data.jpa.repository.JpaRepository;

import Main.Bong.DTO.BongData;

public interface BongDataRepository extends JpaRepository<BongData, Integer> {}
