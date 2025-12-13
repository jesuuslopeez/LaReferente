package lareferente.backend.service;

import lareferente.backend.dto.PlayerDTO;
import lareferente.backend.model.Player;
import lareferente.backend.model.Team;
import lareferente.backend.repository.PlayerRepository;
import lareferente.backend.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlayerService {

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private TeamRepository teamRepository;

    public List<PlayerDTO> getAllPlayers() {
        return playerRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PlayerDTO> getActivePlayers() {
        return playerRepository.findByActivoTrueOrderByApellidosAsc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PlayerDTO> getPlayersByTeam(Long teamId) {
        return playerRepository.findByEquipoIdAndActivoTrue(teamId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PlayerDTO getPlayerById(Long id) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado con ID: " + id));
        return convertToDTO(player);
    }

    public PlayerDTO createPlayer(PlayerDTO playerDTO) {
        // Lógica de negocio: verificar que el equipo existe y está activo
        Team team = null;
        if (playerDTO.getEquipoId() != null) {
            team = teamRepository.findById(playerDTO.getEquipoId())
                    .orElseThrow(() -> new RuntimeException("Equipo no encontrado con ID: " + playerDTO.getEquipoId()));

            if (!team.getActivo()) {
                throw new RuntimeException("No se puede asignar un jugador a un equipo inactivo");
            }
        }

        Player player = new Player();
        player.setNombre(playerDTO.getNombre());
        player.setApellidos(playerDTO.getApellidos());
        player.setFechaNacimiento(playerDTO.getFechaNacimiento());
        player.setNacionalidad(playerDTO.getNacionalidad());
        player.setPosicion(playerDTO.getPosicion());
        player.setDorsal(playerDTO.getDorsal());
        player.setAltura(playerDTO.getAltura());
        player.setPeso(playerDTO.getPeso());
        player.setFotoUrl(playerDTO.getFotoUrl());
        player.setBiografia(playerDTO.getBiografia());
        player.setEquipo(team);
        player.setActivo(true);

        Player savedPlayer = playerRepository.save(player);
        return convertToDTO(savedPlayer);
    }

    public PlayerDTO updatePlayer(Long id, PlayerDTO playerDTO) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado con ID: " + id));

        // Lógica de negocio: verificar que el nuevo equipo existe y está activo
        if (playerDTO.getEquipoId() != null) {
            Team team = teamRepository.findById(playerDTO.getEquipoId())
                    .orElseThrow(() -> new RuntimeException("Equipo no encontrado con ID: " + playerDTO.getEquipoId()));

            if (!team.getActivo()) {
                throw new RuntimeException("No se puede asignar un jugador a un equipo inactivo");
            }
            player.setEquipo(team);
        } else {
            player.setEquipo(null);
        }

        player.setNombre(playerDTO.getNombre());
        player.setApellidos(playerDTO.getApellidos());
        player.setFechaNacimiento(playerDTO.getFechaNacimiento());
        player.setNacionalidad(playerDTO.getNacionalidad());
        player.setPosicion(playerDTO.getPosicion());
        player.setDorsal(playerDTO.getDorsal());
        player.setAltura(playerDTO.getAltura());
        player.setPeso(playerDTO.getPeso());
        player.setFotoUrl(playerDTO.getFotoUrl());
        player.setBiografia(playerDTO.getBiografia());

        Player updatedPlayer = playerRepository.save(player);
        return convertToDTO(updatedPlayer);
    }

    public void deletePlayer(Long id) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado con ID: " + id));
        player.setActivo(false);
        playerRepository.save(player);
    }

    private PlayerDTO convertToDTO(Player player) {
        PlayerDTO dto = new PlayerDTO();
        dto.setId(player.getId());
        dto.setNombre(player.getNombre());
        dto.setApellidos(player.getApellidos());
        dto.setFechaNacimiento(player.getFechaNacimiento());
        dto.setNacionalidad(player.getNacionalidad());
        dto.setPosicion(player.getPosicion());
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

        return dto;
    }
}
