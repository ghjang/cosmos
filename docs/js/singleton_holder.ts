class SingletonHolder
{
    private static className2InstanceMap_ = {};
    
    private constructor() { }

    static getInstance<T>(t: { new(): T }): T
    {
        if (undefined == this.className2InstanceMap_[t.name]) {
            this.className2InstanceMap_[t.name] = new t();
        }
        return this.className2InstanceMap_[t.name];
    }
}
