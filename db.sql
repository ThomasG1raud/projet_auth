DROP TABLE IF EXISTS `comments`;
DROP TABLE IF EXISTS `posts`;
DROP TABLE IF EXISTS  refreshtokens;

DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(45) NOT NULL,
  `lastName` varchar(45) NOT NULL,
  `emailId` varchar(45) NOT NULL,
  `password` LONGTEXT NOT NULL,
  `role` ENUM('client','admin') NOT NULL DEFAULT 'client',
  PRIMARY KEY (`id`),
  UNIQUE KEY `emailId_UNIQUE` (`emailId`)
) ENGINE=InnoDB AUTO_INCREMENT=142 DEFAULT CHARSET=utf8;


CREATE TABLE `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(1000) NOT NULL,
  `imagePath` varchar(1000) NOT NULL,
  `likeCount` int(11) NOT NULL DEFAULT '0',
  `dislikeCount` int(11) NOT NULL DEFAULT '0',
  `datetimeCreated` datetime NOT NULL,
  `addedByUserId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userIdFk1_idx` (`addedByUserId`),
  CONSTRAINT `userIdFk1` FOREIGN KEY (`addedByUserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1072 DEFAULT CHARSET=utf8;


CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `postId` int(11) NOT NULL,
  `comment` varchar(1000) NOT NULL,
  `datetimeCreated` datetime NOT NULL,
  `addedByUserId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `addedByUserId1_idx` (`postId`),
  KEY `addedByUserIdFk1_idx` (`addedByUserId`),
  CONSTRAINT `addedByUserIdFk1` FOREIGN KEY (`addedByUserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `postFk2` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

select * from users;
