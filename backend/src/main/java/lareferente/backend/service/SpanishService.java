package lareferente.backend.service;

import lareferente.backend.dto.PlayerDTO;
import lareferente.backend.model.Player;
import lareferente.backend.repository.SpanishRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SpanishService {

    @Autowired
    private SpanishRepository spanishRepository;

    public List<PlayerDTO> getSpanishPlayers() {
        return spanishRepository.findByNacionalidadAndActivoTrue("España").stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private PlayerDTO convertToDTO(Player player) {
        PlayerDTO dto = new PlayerDTO();
        dto.setId(player.getId());
        dto.setNombre(player.getNombre());
        dto.setApellidos(player.getApellidos());
        dto.setFechaNacimiento(player.getFechaNacimiento());
        dto.setNacionalidad(player.getNacionalidad());
        dto.setPosicion(player.getPosicion());
        dto.setCategoria(player.getCategoria());
        dto.setDorsal(player.getDorsal());
        dto.setAltura(player.getAltura());
        dto.setPeso(player.getPeso());
        dto.setFotoUrl(player.getFotoUrl());
        dto.setBiografia(player.getBiografia());
        dto.setActivo(player.getActivo());

        if (player.getEquipo() != null) {
            dto.setEquipoId(player.getEquipo().getId());
            dto.setEquipoNombre(player.getEquipo().getNombre());
        }

        if (player.getFechaNacimiento() != null) {
            dto.setEdad(Period.between(player.getFechaNacimiento(), LocalDate.now()).getYears());
        }

        return dto;
    }
}
