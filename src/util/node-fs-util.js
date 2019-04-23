const Fs = require("fs");
const Path = require("path");

const TarFs = require("tar-fs");
const Zlib = require("zlib");
const TarStream = require("tar-stream");

export const mkdir = path => {
  if (Fs.existsSync(path) === false) {
    mkdir(Path.dirname(path));
    Fs.mkdirSync(path);
  }
};

const recCp = (hook, old_path, new_path) => {
  const stats = Fs.statSync(old_path);
  const mode = 0o555;
  if (stats.isDirectory()) {
    Fs.mkdirSync(new_path);
    Fs.readdirSync(old_path).forEach(a =>
      recCp(hook, Path.join(old_path, a), Path.join(new_path, a))
    );
  } else {
    hook();
    Fs.copyFileSync(old_path, new_path);
  }
  // Fs.chmodSync(new_path, mode)
};

export const cp = (hook, old_path, new_path) => {
  mkdir(Path.dirname(new_path));
  recCp(hook, old_path, new_path);
};

const recAddToPack = (hook, path, name, pack) => {
  return new Promise((resolve, reject) => {
    const stats = Fs.statSync(path);
    if (stats.isDirectory()) {
      Fs.readdirSync(path)
        .map(a => () =>
          recAddToPack(hook, Path.join(path, a), Path.join(name, a), pack)
        )
        .reduce((acc, val) => acc.then(val), new Promise(a => a()))
        .then(() => {
          resolve();
        });
    } else {
      hook();
      const read_stream = Fs.createReadStream(path);
      const callback = () => {
        resolve();
      };
      const header = {
        name,
        size: stats.size,
        mode: stats.mode,
        mtime: stats.mtime,
        type: "file",
        uid: stats.uid,
        gid: stats.gid
      };
      read_stream.pipe(pack.entry(header, callback));
    }
  });
};

export const tar2 = (hook, old_path, new_path) => {
  return new Promise((resolve, reject) => {
    const pack = TarStream.pack();

    mkdir(Path.dirname(new_path));
    const write_stream = Fs.createWriteStream(new_path);

    pack.pipe(write_stream).on("finish", () => {
      resolve();
    });

    const name = Path.basename(old_path);

    recAddToPack(hook, old_path, name, pack).then(() => {
      pack.finalize();
    });
  });
};

export const tar = (hook, old_path, new_path) => {
  return new Promise((resolve, reject) => {
    mkdir(Path.dirname(new_path));
    const out_stream = Fs.createWriteStream(new_path);
    const options = {
      entries: Fs.readdirSync(old_path),
      map: header => {
        if (header.type === "file") {
          hook();
        }
        return header;
      }
    };
    TarFs.pack(old_path, options)
      .pipe(out_stream)
      .on("finish", () => {
        resolve();
      });
  });
};

export const untar = (hook, old_path, new_path) => {
  return new Promise((resolve, reject) => {
    mkdir(Path.dirname(new_path));
    const inp_stream = Fs.createReadStream(old_path);
    const options = {
      map: header => {
        if (header.type === "file") {
          hook();
        }
        return header;
      }
    };
    inp_stream.pipe(TarFs.extract(new_path, options)).on("finish", () => {
      resolve();
    });
  });
};

export const gzip = (old_path, new_path) => {
  return new Promise((resolve, reject) => {
    mkdir(Path.dirname(new_path));
    const gzip = Zlib.createGzip();

    const inp = Fs.createReadStream(old_path);
    const out = Fs.createWriteStream(new_path);

    inp
      .pipe(gzip)
      .pipe(out)
      .on("finish", () => {
        resolve();
      });
  });
};

export const gunzip = (old_path, new_path) => {
  return new Promise((resolve, reject) => {
    mkdir(Path.dirname(new_path));
    const gunzip = Zlib.createGunzip();

    const inp = Fs.createReadStream(old_path);
    const out = Fs.createWriteStream(new_path);

    inp
      .pipe(gunzip)
      .pipe(out)
      .on("finish", () => {
        resolve();
      });
  });
};

export const extractByName = (name, old_path, new_path) => {
  return new Promise((resolve, reject) => {
    const read_stream = Fs.createReadStream(old_path);

    const extract = TarStream.extract();

    extract.on("entry", function(header, stream, next) {
      if (header.type === "file" && header.name === name) {
        const path = Path.join(new_path, header.name);
        mkdir(Path.dirname(path));
        const write_stream = Fs.createWriteStream(path);
        stream.pipe(write_stream);
      }

      stream.on("end", function() {
        next();
      });

      stream.resume();
    });

    extract.on("finish", function() {
      resolve();
    });

    read_stream.pipe(extract);
  });
};

export const packByName = (content, name, old_path, new_path) => {
  return new Promise((resolve, reject) => {
    const pack = TarStream.pack();
    const extract = TarStream.extract();

    mkdir(Path.dirname(new_path));

    const read_stream = Fs.createReadStream(old_path);
    const write_stream = Fs.createWriteStream(new_path);

    extract.on("entry", function(header, stream, callback) {
      if (header.type === "file" && header.name === name) {
        pack.entry(header, content, callback);
      } else {
        stream.pipe(pack.entry(header, callback));
      }
    });

    extract.on("finish", function() {
      pack.finalize();
    });

    read_stream.pipe(extract);
    pack.pipe(write_stream).on("finish", () => {
      resolve();
    });
  });
};
