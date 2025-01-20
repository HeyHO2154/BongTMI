package Main.Repository.Bong;

import org.springframework.data.jpa.repository.JpaRepository;

import Main.DTO.Bong.BongData;

public interface BongDataRepository extends JpaRepository<BongData, Integer> {}
