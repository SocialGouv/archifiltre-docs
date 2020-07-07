#include <napi.h>
#include <windows.h>

Napi::Value IsFileHidden(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 1) {
        Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
        return env.Null();
    }

    if (!info[0].IsString()) {
         Napi::TypeError::New(env, "isFileHidden expects a string").ThrowAsJavaScriptException();
         return env.Null();
    }

    std::string path = info[0].As<Napi::String>();

    DWORD attributes = GetFileAttributes(path.c_str());

    Napi::Boolean returnValue = Napi::Boolean::New(env, attributes & FILE_ATTRIBUTE_HIDDEN);
    return returnValue;
}


Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "isFileHidden"), Napi::Function::New(env, IsFileHidden));
  return exports;
}

NODE_API_MODULE(fileinfo, Init)
