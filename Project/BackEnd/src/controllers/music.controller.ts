import { Request, Response } from "express";

// ✅ Public - Lấy tất cả bài hát
export const getAllSongs = async (req: Request, res: Response) => {
  try {
    res.json({ 
      message: "Get all songs",
      songs: [
        { id: 1, title: "Song 1", artist: "Artist 1" },
        { id: 2, title: "Song 2", artist: "Artist 2" }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Public - Lấy 1 bài hát
export const getSongById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.json({ 
      message: `Get song ${id}`,
      song: { id, title: "Song Title", artist: "Artist Name" }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Cần login - Lấy playlists của user
export const getMyPlaylists = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const username = req.user!.username;
    
    res.json({ 
      message: `Playlists của ${username}`,
      userId,
      playlists: [
        { id: 1, name: "My Favorites", userId }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Cần login - Tạo playlist
export const createPlaylist = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const userId = req.user!.id;
    
    res.status(201).json({ 
      message: "Playlist created",
      playlist: { id: Date.now(), name, userId }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Admin only - Upload bài hát
export const uploadSong = async (req: Request, res: Response) => {
  try {
    const { title, artist } = req.body;
    const adminUsername = req.user!.username;
    
    res.status(201).json({ 
      message: `Admin ${adminUsername} uploaded song`,
      song: { id: Date.now(), title, artist }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Admin only - Xóa bài hát
export const deleteSong = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminUsername = req.user!.username;
    
    res.json({ 
      message: `Admin ${adminUsername} deleted song ${id}`
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Admin only - Xóa user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.json({ message: `User ${id} deleted` });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Admin hoặc Moderator - Cập nhật bài hát
export const updateSong = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, artist } = req.body;
    
    res.json({ 
      message: `Song ${id} updated`,
      song: { id, title, artist }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Admin hoặc Moderator - Duyệt bài hát
export const approveSong = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.json({ message: `Song ${id} approved` });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Owner hoặc Admin - Cập nhật playlist
export const updatePlaylist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    res.json({ 
      message: `Playlist ${id} updated`,
      playlist: { id, name }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Owner hoặc Admin - Xóa playlist
export const deletePlaylist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.json({ message: `Playlist ${id} deleted` });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Optional auth - Recommendations
export const getRecommendations = async (req: Request, res: Response) => {
  try {
    if (req.user) {
      // User đã login - personalized
      res.json({ 
        message: "Personalized recommendations",
        username: req.user.username,
        songs: [
          { id: 1, title: "Based on your history" }
        ]
      });
    } else {
      // Guest - general
      res.json({ 
        message: "General recommendations",
        songs: [
          { id: 1, title: "Popular song" }
        ]
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};