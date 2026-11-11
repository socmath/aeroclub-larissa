export interface GalleryPhoto {
  /** File name, shared by the full-size and thumbnail versions */
  file: string;
  caption: string;
}

export const GALLERY_PHOTOS: readonly GalleryPhoto[] = [
  { file: 'air-20180330-mount-Olympos-SXUBD.jpg', caption: 'Πτήση πάνω από τον Όλυμπο' },
  { file: '20180801.jpg', caption: 'Λίμνη Πλαστήρα' },
  { file: '20181107.jpg', caption: 'Αγώνες αερομοντελισμού' },
  { file: '20181120-1.jpg', caption: 'Πεδίο Τερψιθέας: επίσκεψη αυτόγυρων' },
  { file: 'IMG_20230610_094326-PANO.jpg', caption: 'Πανοραμική όψη πεδίου Τερψιθέας' },
  { file: 'IMG_2659.jpg', caption: 'Άποψη της κοιλάδας των Τεμπών' },
  { file: 'IMG_2665.jpg', caption: 'Αγιόκαμπος' },
  { file: 'IMG_2670.jpg', caption: 'Πήλιο - λίμνη Κάρλα' },
  { file: 'IMG_2679-EDIT.jpg', caption: 'Πτήση πάνω από τη Φαρκαδώνα' },
  { file: 'UBD-20180301.jpg', caption: 'SX-UBD' },
  { file: 'aerolesxi3.jpg', caption: 'RF-5A - Εγκαταστάσεις Αερολέσχης' },
  { file: 'aerolesxi_larisas_credits_kontopoulos-3.jpg', caption: 'Πτήση πάνω από τη Λάρισα' },
  { file: 'air-20180405-skiathos-final.jpg', caption: 'Προσέγγιση στο αεροδρόμιο της Σκιάθου' },
  { file: 'air-20181120.jpg', caption: 'Επίσκεψη αυτόγυρων στο πεδίο της Τερψιθέας' },
];

export const fullImageUrl = (p: GalleryPhoto) => `assets/images/${p.file}`;
export const thumbImageUrl = (p: GalleryPhoto) => `assets/images/small_versions/${p.file}`;
